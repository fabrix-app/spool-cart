// tslint:disable:no-console
import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
import * as csvParser from 'papaparse'
import * as _ from 'lodash'
import * as shortid from 'shortid'
import * as fs from 'fs'
import { SUBSCRIPTION_UPLOAD } from '../../enums'

/**
 * @module SubscriptionCsvService
 * @description Subscription Csv Service
 */
export class SubscriptionCsvService extends Service {
  publish(type, event, options: {save?: boolean, transaction?: any, include?: any} = {}) {
    if (this.app.services.EventsService) {
      options.include = options.include ||  [{
        model: this.app.models.EventItem.instance,
        as: 'objects'
      }]
      return this.app.services.EventsService.publish(type, event, options)
    }
    this.app.log.debug('spool-events is not installed, please install it to use publish')
    return Promise.resolve()
  }
  /**
   *
   * @param file
   * @returns {Promise}
   */
  subscriptionCsv(file) {
    console.time('csv')
    const uploadID = shortid.generate()
    const EventsService = this.app.services.EventsService
    const errors = []
    let errorsCount = 0, lineNumber = 1
    return new Promise((resolve, reject) => {
      const options = {
        header: true,
        dynamicTyping: true,
        encoding: 'utf-8',
        step: (results, parser) => {
          parser.pause()
          lineNumber++
          return this.csvSubscriptionRow(results.data[0], uploadID)
            .then(row => {
              parser.resume()
            })
            .catch(err => {
              errorsCount++
              errors.push(`Line ${lineNumber}: ${err.message}`)
              this.app.log.error('ROW ERROR', err)
              parser.resume()
            })
        },
        complete: (results, _file) => {
          console.timeEnd('csv')
          results.upload_id = uploadID
          EventsService.count('SubscriptionUpload', { where: { upload_id: uploadID }})
            .then(count => {
              results.subscriptions = count
              results.errors = errors
              results.errors_count = errorsCount
              // Publish the event
              EventsService.publish('subscription_upload.complete', results)
              return resolve(results)
            })
            .catch(err => {
              errorsCount++
              errors.push(err.message)
              results.errors = errors
              results.errors_count = errorsCount
              return resolve(results)
            })
        },
        error: (err, _file) => {
          return reject(err)
        }
      }
      const fileString = fs.readFileSync(file, 'utf8')
      // Parse the CSV/TSV
      csvParser.parse(fileString, options)
    })
  }

  /**
   *
   * @param row
   * @param uploadID
   */
  csvSubscriptionRow(row, uploadID) {
    // Wrap this in a promise so we can gracefully handle an error
    return Promise.resolve()
      .then(() => {
        const SubscriptionUpload = this.app.models.SubscriptionUpload
        const values = _.values(SUBSCRIPTION_UPLOAD)
        const keys = _.keys(SUBSCRIPTION_UPLOAD)
        const upload: {[key: string]: any} = {
          upload_id: uploadID,
          options: {}
        }

        _.each(row, (data, key) => {
          if (typeof(data) === 'undefined' || data === '') {
            row[key] = null
          }
        })

        row = _.omitBy(row, _.isNil)

        if (_.isEmpty(row)) {
          return Promise.resolve({})
        }

        _.each(row, (data, key) => {
          if (typeof(data) !== 'undefined' && data !== null && data !== '') {
            const i = values.indexOf(key.replace(/^\s+|\s+$/g, ''))
            const k = keys[i]
            if (i > -1 && k) {
              if (k === 'products') {
                upload[k] = data.split(',').map(product => { return product.trim()})
              }
              else {
                upload[k] = data
              }
            }
          }
        })

        upload.products = _.map(upload.products, (handle, index) => {
          return {
            handle: handle
          }
        })

        // customer is required, if not here, then reject whole row without error
        if (!upload.customer) {
          return Promise.resolve({})
        }

        const newSubscription = SubscriptionUpload.build(upload)

        return newSubscription.save()
      })
  }

  /**
   *
   * @param uploadId
   * @returns {Promise}
   */
  processSubscriptionUpload(uploadId) {
    const SubscriptionUpload = this.app.models.SubscriptionUpload
    const errors = []
    let subscriptionsTotal = 0, errorsCount = 0
    return SubscriptionUpload.batch({
      where: {
        upload_id: uploadId
      }
    }, (subscriptions) => {

      const Sequelize = this.app.models.Subscription.sequelize

      return Sequelize.Promise.mapSeries(subscriptions, subscription => {
        const create = {
          customer: {
            email: subscription.customer
          },
          email: subscription.customer,
          products: subscription.products,
          interval: subscription.interval,
          unit: subscription.unit,
          active: subscription.active,
          token: subscription.token
        }
        return this.transformFromRow(create)
          .then(() => {
            subscriptionsTotal++
            return
          })
          .catch(err => {
            errorsCount++
            errors.push(`${subscription.customer}: ${err.message}`)
            return
          })
      })
    })
      .then(results => {
        return SubscriptionUpload.destroy({where: { upload_id: uploadId }})
          .catch(err => {
            errorsCount++
            errors.push(err.message)
            return
          })
      })
      .then(destroyed => {
        const results = {
          upload_id: uploadId,
          subscriptions: subscriptionsTotal,
          errors: errors,
          errors_count: errorsCount
        }
        this.app.services.EventsService.publish('subscription_process.complete', results)
        return results
      })
  }

  /**
   *
   * @param obj
   * @param options
   * @returns {Promise.<TResult>}
   */
  transformFromRow(obj, options: {[key: string]: any} = {}) {
    let resCustomer, resProducts
    const Customer = this.app.models['Customer']
    const Subscription = this.app.models['Subscription']
    const resSubscription = Subscription.build(obj)

    return Customer.resolve(obj.customer, {transaction: options.transaction || null, create: true})
      .then(customer => {
        resCustomer = customer
        return this.app.models['Product'].findAll({
          where: {
            handle: obj.products.map(product => product.handle)
          },
          transaction: options.transaction || null
        })
      })
      .then(products => {
        resProducts = products
        return Promise.all(resProducts.map(item => {
          return this.app.services.ProductService.resolveItem(item, {transaction: options.transaction || null})
        }))
      })
      .then(resolvedItems => {
        return Subscription.sequelize.Promise.mapSeries(resolvedItems, (item) => {
          // item = _.omit(item.get({plain: true}), [
          //   'requires_subscription',
          //   'subscription_unit',
          //   'subscription_interval'
          // ])
          return resSubscription.addLine(item, 1, [], null)
        })
      })
      .then(resolvedItems => {
        resSubscription.customer_id = resCustomer.id
        return resSubscription.save({transaction: options.transaction || null})
      })
      .then(subscription => {

        const event = {
          object_id: subscription.customer_id,
          object: 'customer',
          objects: [{
            customer: subscription.customer_id
          }, {
            subscription: subscription.id
          }],
          type: 'customer.subscription.started',
          message: `Customer imported subscription ${subscription.token} started`,
          data: subscription
        }
        return this.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      }).then(event => {
        return resSubscription
      })
  }
}

