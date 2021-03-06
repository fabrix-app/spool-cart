// tslint:disable:no-console
import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
import * as csvParser from 'papaparse'
import * as _ from 'lodash'
import * as shortid from 'shortid'
import * as fs from 'fs'
import { VENDOR_UPLOAD } from '../../enums'

/**
 * @module VendorCsvService
 * @description Vendor CSV Service
 */
export class VendorCsvService extends Service {
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
  vendorCsv(file) {
    // TODO validate csv
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
          return this.csvVendorRow(results.data[0], uploadID)
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
          EventsService.count('VendorUpload', { where: { upload_id: uploadID }})
            .then(count => {
              results.vendors = count
              results.errors_count = errorsCount
              results.errors = errors
              // Publish the event
              EventsService.publish('vendor_upload.complete', results)
              return resolve(results)
            })
            .catch(err => {
              errorsCount++
              errors.push(err.message)
              results.errors_count = errorsCount
              results.errors = errors
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
  csvVendorRow(row, uploadID) {
    const VendorUpload = this.app.models.VendorUpload
    const values = _.values(VENDOR_UPLOAD)
    const keys = _.keys(VENDOR_UPLOAD)
    const upload = {
      upload_id: uploadID,
      options: {},
      products: []
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
          if (k === 'handle') {
            upload[k] = this.app.services.ProxyCartService.splitHandle(data.toString())
          }
          else if (k === 'name') {
            upload[k] = data.toString().trim()
          }
          else if (k === 'products') {
            upload[k] = data.toString().split(',').map(product => { return product.trim()})
          }
          else {
            upload[k] = data
          }
        }
      }
    })

    upload.products = upload.products.map((handle, index) => {
      return {
        handle: handle
      }
    })

    const newVendor = VendorUpload.build(upload)
    return newVendor.save()
  }

  /**
   *
   * @param uploadId
   * @returns {Promise}
   */
  processVendorUpload(uploadId) {
    const VendorUpload = this.app.models.VendorUpload
    let vendorsTotal = 0
    const errors = []

    return VendorUpload.batch({
      where: {
        upload_id: uploadId
      }
    }, vendors => {
      const Sequelize = this.app.models.Product.sequelize
      return Sequelize.Promise.mapSeries(vendors, vendor => {
        const create = {
          customer: {
            email: vendor.customer
          },
          email: vendor.customer,
          status: vendor.status,
          shipping_address: {},
          billing_address: {}
        }

        // Convert to normal object
        vendor = vendor instanceof this.app.models['VendorUpload'].instance ? vendor.get({plain: true}) : vendor

        _.each(vendor, (value, key) => {
          if (key.indexOf('shipping_') > -1) {
            const newKey = key.replace('shipping_', '')
            if (value && value !== '') {
              create.shipping_address[newKey] = value
            }
          }
          if (key.indexOf('billing_') > -1) {
            const newKey = key.replace('billing_', '')
            if (value && value !== '') {
              create.billing_address[newKey] = value
            }
          }
        })
        if (_.isEmpty(create.shipping_address)) {
          delete create.shipping_address
        }
        if (_.isEmpty(create.billing_address)) {
          delete create.billing_address
        }
        return this.transformFromRow(create)
          .catch(err => {
            errors.push(err.message)
            return err
          })
      })
        .then(vendor => {
          if (!vendor) {
            return
          }
          else {
            // Calculate Totals
            vendorsTotal++
            return vendor
          }
        })
    })
      .then(results => {
        return VendorUpload.destroy({where: {upload_id: uploadId }})
          .catch(err => {
            errors.push(err.message)
            return err
          })
      })
      .then(destroyed => {
        const results = {
          upload_id: uploadId,
          vendors: vendorsTotal,
          errors: errors
        }
        this.app.services.EventsService.publish('vendor_process.complete', results)
        return results
      })
  }

  transformFromRow(obj) {
    let resCustomer, resProducts
    const resVendor = this.app.models['Vendor'].build()
    const Customer = this.app.models['Customer']

    return Customer.resolve(obj.customer, {create: true})
      .then(customer => {
        resCustomer = customer
        return this.app.models['Product'].findAll({
          where: {
            handle: obj.products.map(product => product.handle)
          }
        })
      })
      .then(products => {
        resProducts = products
        return Promise.all(resProducts.map(item => {
          return this.app.services.ProductService.resolveItem(item)
        }))
      })
      .then(resolvedItems => {
        return Promise.all(resolvedItems.map((item) => {
          // item = _.omit(item.get({plain: true}), [
          //   'requires_vendor',
          //   'vendor_unit',
          //   'vendor_interval'
          // ])
          return resVendor.addLine(item, 1, [])
        }))
      })
      .then(resolvedItems => {
        resVendor.customer_id = resCustomer.id
        return resVendor.save()
      })
      .then(vendor => {

        const event = {
          object_id: vendor.customer_id,
          object: 'customer',
          type: 'customer.vendor.created',
          message: 'Imported Vendor Created',
          data: vendor
        }
        this.publish(event.type, event, {save: true})

        return vendor
      })
  }
}

