import { FabrixController as Controller } from '@fabrix/fabrix/dist/common'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import * as Validator from '../../validator'
import { defaults } from 'lodash'

/**
 * @module SubscriptionController
 * @description Subscription Controller
 */
export class SubscriptionController extends Controller {
  generalStats(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    SubscriptionService.generalStats()
      .then(results => {
        res.json(results)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   * count the amount of subscriptions
   * @param req
   * @param res
   */
  count(req, res) {
    const EventsService = this.app.services.EventsService
    EventsService.count('Subscription')
      .then(count => {
        const counts = {
          subscriptions: count
        }
        return res.json(counts)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  findById(req, res) {
    const orm = this.app.models
    const Subscription = orm['Subscription']
    const id = req.params.id

    Subscription.findByIdDefault(id, {})
      .then(subscription => {
        if (!subscription) {
          throw new ModelError('E_NOT_FOUND', `Subscription id ${id} not found`)
        }
        return this.app.services.PermissionsService.sanitizeResult(req, subscription)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  findByToken(req, res) {
    const orm = this.app.models
    const Subscription = orm['Subscription']
    const token = req.params.token

    Subscription.findByTokenDefault(token, {})
      .then(subscription => {
        if (!subscription) {
          throw new ModelError('E_NOT_FOUND', `Subscription token ${token} not found`)
        }
        return this.app.services.PermissionsService.sanitizeResult(req, subscription)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  resolve(req, res) {
    const orm = this.app.models
    const Subscription = orm['Subscription']
    let id = req.params.id
    if (!id && req.subscription) {
      id = req.subscription.id
    }
    Subscription.resolve(id, {})
      .then(subscription => {
        if (!subscription) {
          throw new ModelError('E_NOT_FOUND', `Subscription id ${id} not found`)
        }
        return this.app.services.PermissionsService.sanitizeResult(req, subscription)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  findAll(req, res) {
    const orm = this.app.models
    const Subscription = orm['Subscription']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    const where = req.jsonCriteria(req.query.where)

    Subscription.findAndCountAll({
      order: sort,
      offset: offset,
      limit: limit,
      where: where
    })
      .then(subscriptions => {
        // Paginate
        res.paginate(subscriptions.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, subscriptions.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  search(req, res) {
    const orm = this.app.models
    const Subscription = orm['Subscription']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    const term = req.query.term
    const where = req.jsonCriteria(req.query.where)
    const defaultWhere = defaults(where, {
      $or: [
        {
          token: {
            $iLike: `%${term}%`
          }
        },
        {
          email: {
            $iLike: `%${term}%`
          }
        }
      ]
    })
    Subscription.findAndCountAll({
      where: defaultWhere,
      subscription: sort,
      offset: offset,
      req: req,
      limit: limit
    })
      .then(subscriptions => {
        // Paginate
        res.paginate(subscriptions.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, subscriptions.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  update(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const id = req.params.id

    if (!req.body) {
      req.body = {}
    }

    Validator.validateSubscription.update(req.body)
      .then(values => {
        return SubscriptionService.update(req.body, id)
      })
      .then(subscription => {
        return this.app.services.PermissionsService.sanitizeResult(req, subscription)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  activate(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const id = req.params.id

    Validator.validateSubscription.activate(req.body)
      .then(values => {
        req.body.id = id
        return SubscriptionService.activate(req.body, id)
      })
      .then(subscription => {
        return this.app.services.PermissionsService.sanitizeResult(req, subscription)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  deactivate(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const id = req.params.id

    Validator.validateSubscription.deactivate(req.body)
      .then(values => {
        req.body.id = id
        return SubscriptionService.deactivate(req.body, id)
      })
      .then(subscription => {
        return this.app.services.PermissionsService.sanitizeResult(req, subscription)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  renew(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const id = req.params.id

    SubscriptionService.renew(id)
      .then(subscription => {
        if (!subscription) {
          throw new Error('Unexpected Error while renewing subscription')
        }
        return this.app.services.PermissionsService.sanitizeResult(req, subscription)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  cancel(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const id = req.params.id

    Validator.validateSubscription.cancel(req.body)
      .then(values => {
        req.body.id = id
        return SubscriptionService.cancel(req.body, id)
      })
      .then(subscription => {
        if (!subscription) {
          throw new Error('Unexpected Error while Cancelling Subscription')
        }
        return this.app.services.PermissionsService.sanitizeResult(req, subscription)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  addItems(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const id = req.params.id

    Validator.validateSubscription.addItems(req.body)
      .then(values => {
        return SubscriptionService.addItems(req.body, id)
      })
      .then(subscription => {
        if (!subscription) {
          throw new Error('Unexpected Error while adding items')
        }
        return this.app.services.PermissionsService.sanitizeResult(req, subscription)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  removeItems(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    let id = req.params.id
    if (!id && req.subscription) {
      id = req.subscription.id
    }
    Validator.validateSubscription.removeItems(req.body)
      .then(values => {
        return SubscriptionService.removeItems(req.body, id)
      })
      .then(subscription => {
        if (!subscription) {
          throw new Error('Unexpected Error while removing items')
        }
        return this.app.services.PermissionsService.sanitizeResult(req, subscription)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  customer(req, res) {
    const orm = this.app.models
    const Subscription = orm['Subscription']
    const Customer = orm['Customer']
    Subscription.findById(req.params.id, {
      attributes: ['id', 'customer_id']
    })
      .then(subscription => {
        if (!subscription) {
          throw new ModelError('E_NOT_FOUND', `Subscription id ${ req.params.id } not found`)
        }
        if (!subscription.customer_id) {
          throw new ModelError('E_NOT_FOUND', `Subscription id ${ req.params.id } customer not found`)
        }
        return Customer.findById(subscription.customer_id)
      })
      .then(customer => {
        if (!customer) {
          throw new ModelError('E_NOT_FOUND', `Subscription id ${ req.params.id } customer not found`)
        }
        return this.app.services.PermissionsService.sanitizeResult(req, customer)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  orders(req, res) {
    const orm = this.app.models
    const Subscription = orm['Subscription']
    const Order = orm['Order']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    const where = req.jsonCriteria(req.query.where)

    Subscription.findById(req.params.id, {
      attributes: ['id', 'token']
    })
      .then(subscription => {
        if (!subscription) {
          throw new ModelError('E_NOT_FOUND', `Subscription id ${ req.params.id } not found`)
        }
        if (!subscription.token) {
          throw new ModelError('E_NOT_FOUND', `Subscription token ${ req.params.id } token not found`)
        }
        return Order.findAndCountAll(defaults(where, {
          where: {
            subscription_token: subscription.token
          },
          order: sort,
          offset: offset,
          limit: limit
        }))
      })
      .then(customer => {
        return this.app.services.PermissionsService.sanitizeResult(req, customer)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }



  /**
   * upload CSV
   * @param req
   * @param res
   */
  uploadCSV(req, res) {
    const SubscriptionCsvService = this.app.services.SubscriptionCsvService
    const csv = req.file

    if (!csv) {
      const err = new Error('File failed to upload')
      return res.serverError(err)
    }

    SubscriptionCsvService.subscriptionCsv(csv.path)
      .then(result => {
        return res.json({
          file: req.file,
          result: result
        })
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  processUpload(req, res) {
    const SubscriptionCsvService = this.app.services.SubscriptionCsvService
    SubscriptionCsvService.processSubscriptionUpload(req.params.id)
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   *
   * @param req
   * @param res
   */
  exportSubscriptions(req, res) {
    //
  }

  // TODO
  customerIsSubscribed(req, res) {

  }

  /**
   *
   * @param req
   * @param res
   */
  event(req, res) {
    const Event = this.app.models['Event']
    const eventId = req.params.event

    if (!eventId || !req.user) {
      const err = new Error('A order id and a user in session are required')
      res.send(401, err)

    }
    Event.findById(eventId)
      .then(event => {
        return this.app.services.PermissionsService.sanitizeResult(req, event)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  events(req, res) {
    const Event = this.app.models['Event']
    const subscriptionId = req.params.id

    if (!subscriptionId && !req.user) {
      const err = new Error('A order id and a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    Event.findAndCountAll({
      order: sort,
      where: {
        object_id: subscriptionId,
        object: 'subscription'
      },
      offset: offset,
      limit: limit
    })
      .then(events => {
        // Paginate
        res.paginate(events.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, events.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
}

