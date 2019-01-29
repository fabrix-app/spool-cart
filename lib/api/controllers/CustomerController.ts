import { FabrixController as Controller } from '@fabrix/fabrix/dist/common'
import * as Validator from '../../validator'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { isNumber, isString, defaults } from 'lodash'
/**
 * @module CustomerController
 * @description Customer Controller.
 */
// TODO lock down certain requests by Owner(s)
export class CustomerController extends Controller {
  generalStats(req, res) {
    res.json({})
  }
  /**
   *
   * @param req
   * @param res
   */
  count(req, res) {
    const EventsService = this.app.services.EventsService
    EventsService.count('Customer')
      .then(count => {
        const counts = {
          customers: count
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
  session(req, res) {
    if (!req.customer) {
      return res.sendStatus(401)
    }
    return this.app.services.PermissionsService.sanitizeResult(req, req.customer)
    .then(result => {
      return res.json(result)
    })
  }

  /**
   *
   * @param req
   * @param res
   */
  search(req, res) {
    const orm = this.app.models
    const Customer = orm['Customer']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['last_name', 'ASC']]
    const term = req.query.term
    const where = req.jsonCriteria(req.query.where)
    const defaultQuery = defaults(where, {
      $or: [
        {
          first_name: {
            $iLike: `%${term}%`
          }
        },
        {
          last_name: {
            $iLike: `%${term}%`
          }
        },
        {
          email: {
            $iLike: `%${term}%`
          }
        },
        {
          company: {
            $iLike: `%${term}%`
          }
        }
      ]
    })
    Customer.findAndCountAll({
      where: defaultQuery,
      order: sort,
      offset: offset,
      req: req,
      limit: limit
    })
      .then(customers => {
        // Paginate
        res.paginate(customers.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, customers.rows)
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
  findById(req, res) {
    const orm = this.app.models
    const Customer = orm['Customer']
    let id = req.params.id
    if (!id && req.customer) {
      id = req.customer.id
    }
    Customer.findByIdDefault(id, {})
      .then(customer => {
        if (!customer) {
          throw new ModelError('E_NOT_FOUND', `Customer id ${id} not found`)
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
  findByToken(req, res) {
    const orm = this.app.models
    const Customer = orm['Customer']
    let token = req.params.id
    if (!token && req.customer) {
      token = req.customer.token
    }
    Customer.findByTokenDefault(token, {})
      .then(customer => {
        if (!customer) {
          throw new ModelError('E_NOT_FOUND', `Customer token ${token} not found`)
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
  findAll(req, res) {
    const orm = this.app.models
    const Customer = orm['Customer']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    const where = req.jsonCriteria(req.query.where)

    Customer.findAndCountAll({
      order: sort,
      offset: offset,
      limit: limit,
      where: where
    })
      .then(customers => {
        res.paginate(customers.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, customers.rows)
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
  findByTag(req, res) {
    const orm = this.app.models
    const Customer = orm['Customer']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    Customer.findAndCountDefault({
      where: {
        '$tags.name$': req.params.tag
      },
      order: sort,
      offset: offset,
      req: req,
      include: [
        {
          model: this.app.models['Tag'].instance,
          as: 'tags'
        }
      ]
      // limit: limit // TODO Sequelize breaks if a limit is here.
    })
      .then(customers => {
        // Paginate
        res.paginate(customers.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, customers.rows)
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
  findByCollection(req, res) {
    const orm = this.app.models
    const Customer = orm['Customer']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    Customer.findAndCountDefault({
      where: {
        '$collections.handle$': req.params.handle
      },
      include: [
        {
          model: this.app.models['Collection'].instance,
          as: 'collections'
        }
      ],
      order: sort,
      offset: offset,
      req: req
      // limit: limit // TODO Sequelize breaks if a limit is here.
    })
      .then(customers => {
        // Paginate
        res.paginate(customers.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, customers.rows)
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
  create(req, res) {

    // if (req.user && !req.body.owners) {
    //   req.body.owners = [req.user]
    // }

    const CustomerService = this.app.services.CustomerService
    Validator.validateCustomer.create(req.body)
      .then(values => {
        return CustomerService.create(req.body)
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

  createAndLogin(req, res) {

    // if (req.user && !req.body.owners) {
    //   req.body.owners = [req.user]
    // }

    const CustomerService = this.app.services.CustomerService
    Validator.validateCustomer.create(req.body)
      .then(values => {
        return CustomerService.create(req.body)
      })
      .then(customer => {
        return new Promise((resolve, reject) => {
          req.loginCustomer(customer, function (err) {
            if (err) {
              return reject(err)
            }
            return resolve(customer)
          })
        })
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
   *
   * @param req
   * @param res
   */
  update(req, res) {
    const CustomerService = this.app.services.CustomerService
    let id = req.params.id

    if (!id && req.customer) {
      id = req.customer.id
    }
    if (!req.body) {
      req.body = {}
    }
    if (!req.body.id) {
      req.body.id = id
    }
    Validator.validateCustomer.update(req.body)
      .then(values => {
        return CustomerService.update(req.body)
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

  accountBalance(req, res) {
    const CustomerService = this.app.services.CustomerService
    const id = req.params.id
    if (!req.body) {
      req.body = {}
    }
    if (!req.body.id) {
      req.body.id = id
    }
    Validator.validateCustomer.accountBalance(req.body)
      .then(values => {
        return CustomerService.accountBalance(req.body)
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
    const CustomerCsvService = this.app.services.CustomerCsvService
    const csv = req.file

    if (!csv) {
      const err = new Error('File failed to upload')
      return res.serverError(err)
    }

    CustomerCsvService.customerCsv(csv.path)
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
    const CustomerCsvService = this.app.services.CustomerCsvService
    CustomerCsvService.processCustomerUpload(req.params.id)
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
  exportCustomers(req, res) {
    //
  }

  /**
   *
   * @param req
   * @param res
   */
  login(req, res) {
    let customerId = req.params.id
    const Customer = this.app.models['Customer']

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }

    if (!customerId && !req.user) {
      const err = new Error('A customer id and a user in session are required')
      return res.send(401, err)
    }

    Customer.findById(customerId)
      .then(customer => {
        if (!customer) {
          throw new Error('Unexpected Error while authenticating customer')
        }
        return new Promise((resolve, reject) => {
          req.loginCustomer(customer, function (err) {
            if (err) {
              return reject(err)
            }
            return resolve(customer)
          })
        })
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
   *
   * @param req
   * @param res
   */
  switchCustomer(req, res) {
    const customerId = req.params.id
    const Customer = this.app.models['Customer']
    const User = this.app.models['User']

    if (!customerId && !req.user) {
      const err = new Error('A customer id and a user in session are required')
      return res.send(401, err)
    }
    User.findById(req.user.id)
      .then(user => {
        user.current_customer_id = customerId
        return user.save()
      })
      .then(user => {
        return Customer.findById(customerId)
      })
      .then(customer => {
        return new Promise((resolve, reject) => {
          req.loginCustomer(customer, (err) => {
            if (err) {
              return reject(err)
            }
            return resolve(customer)
          })
        })
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
   *
   * @param req
   * @param res
   */
  logout(req, res) {
    req.logoutCustomer()
    res.ok()
  }

  /**
   *
   * @param req
   * @param res
   */
  account(req, res) {
    const Account = this.app.models['Account']
    const accountId = req.params.account
    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !accountId || !req.user) {
      const err = new Error('A customer id and a user in session are required')
      res.send(401, err)

    }
    Account.findByIdDefault(accountId)
      .then(account => {
        return this.app.services.PermissionsService.sanitizeResult(req, account)
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
  accounts(req, res) {
    const Account = this.app.models['Account']
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id and a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    Account.findAndCountAll({
      account: sort,
      where: {
        customer_id: customerId
      },
      offset: offset,
      limit: limit
    })
      .then(accounts => {
        // Paginate
        res.paginate(accounts.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, accounts.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  // TODO
  addAccount(req, res) {

  }
  // TODO
  removeAccount(req, res) {

  }
  /**
   *
   * @param req
   * @param res
   */
  // TODO
  updateAccount(req, res) {
    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id and a user in session are required')
      return res.serverError(err)
    }
  }

  /**
   *
   * @param req
   * @param res
   */
  accountSources(req, res) {
    const Source = this.app.models['Source']
    let customerId = req.params.id
    const accountId = req.params.account

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id and a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    Source.findAndCountAll({
      order: sort,
      where: {
        customer_id: customerId,
        account_id: accountId
      },
      offset: offset,
      limit: limit
    })
      .then(sources => {
        // Paginate
        res.paginate(sources.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, sources.rows)
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
  accountTransactions(req, res) {
    const Transaction = this.app.models['Transaction']
    let customerId = req.params.id
    const accountId = req.params.account

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id and a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    Transaction.findAndCountAll({
      order: sort,
      where: {
        customer_id: customerId,
        account_id: accountId
      },
      offset: offset,
      limit: limit
    })
      .then(transactions => {
        // Paginate
        res.paginate(transactions.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, transactions.rows)
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
  order(req, res) {
    const Order = this.app.models['Order']
    const orderId = req.params.order
    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !orderId || !req.user) {
      const err = new Error('A customer id and a user in session are required')
      res.send(401, err)

    }
    Order.resolve(orderId, {
      include: [
        {
          as: 'order_items',
          model: this.app.models['OrderItem'].instance
        },
        {
          model: this.app.models['Transaction'].instance,
          as: 'transactions'
        },
        {
          model: this.app.models['Fulfillment'].instance,
          as: 'fulfillments',
          include: [
            {
              model: this.app.models['OrderItem'].instance,
              as: 'order_items',
              attributes: ['id', 'quantity', 'fulfillment_status', 'fulfillment_service']
            }
          ]
        },
        {
          model: this.app.models['Refund'].instance,
          as: 'refunds'
        },
        // {
        //   model: app.models['Event'],
        //   as: 'events'
        // },
        {
          model: this.app.models['Tag'].instance,
          as: 'tags'
        }
      ]
    })
      .then(order => {
        return this.app.services.PermissionsService.sanitizeResult(req, order)
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
    const Order = this.app.models['Order']
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !req.user) {
      const err = new Error('A customer id and a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    Order.findAndCountAll({
      order: sort,
      where: {
        customer_id: customerId
      },
      offset: offset,
      limit: limit
    })
      .then(orders => {
        // Paginate
        res.paginate(orders.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, orders.rows)
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
  subscription(req, res) {
    const Subscription = this.app.models['Subscription']
    const subscriptionId = req.params.subscription
    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !subscriptionId ||  !req.user) {
      const err = new Error('A customer id, subscription id, and a user in session are required')
      return res.forbidden(err)
    }

    Subscription.resolve(subscriptionId)
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

  /**
   *
   * @param req
   * @param res
   * @returns {*}
   */
  subscriptionUpdate(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const subscriptionId = req.params.subscription

    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !subscriptionId ||  !req.user) {
      const err = new Error('A customer id, subscription id, and a user in session are required')
      return res.forbidden(err)
    }

    if (!req.body) {
      req.body = {}
    }

    Validator.validateSubscription.update(req.body)
      .then(values => {
        return SubscriptionService.update(req.body, subscriptionId)
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

  /**
   *
   * @param req
   * @param res
   * @returns {*}
   */
  subscriptionActivate(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const subscriptionId = req.params.subscription

    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !subscriptionId ||  !req.user) {
      const err = new Error('A customer id, subscription id, and a user in session are required')
      return res.forbidden(err)
    }

    Validator.validateSubscription.activate(req.body)
      .then(values => {
        req.body.id = subscriptionId
        return SubscriptionService.activate(req.body, subscriptionId)
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

  /**
   *
   * @param req
   * @param res
   * @returns {*}
   */
  subscriptionDeactivate(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const subscriptionId = req.params.subscription

    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !subscriptionId ||  !req.user) {
      const err = new Error('A customer id, subscription id, and a user in session are required')
      return res.forbidden(err)
    }

    Validator.validateSubscription.deactivate(req.body)
      .then(values => {
        req.body.id = subscriptionId
        return SubscriptionService.deactivate(req.body, subscriptionId)
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

  /**
   *
   * @param req
   * @param res
   * @returns {*}
   */
  subscriptionRenew(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const subscriptionId = req.params.subscription

    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }

    if (!customerId || !subscriptionId ||  !req.user) {
      const err = new Error('A customer id, subscription id, and a user in session are required')
      return res.forbidden(err)
    }

    SubscriptionService.renew(subscriptionId)
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

  /**
   *
   * @param req
   * @param res
   * @returns {*}
   */
  subscriptionCancel(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const subscriptionId = req.params.subscription
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }

    if (!customerId || !subscriptionId ||  !req.user) {
      const err = new Error('A customer id, subscription id, and a user in session are required')
      return res.forbidden(err)
    }

    Validator.validateSubscription.cancel(req.body)
      .then(values => {
        return SubscriptionService.cancel(req.body, subscriptionId)
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
  subscriptionAddItems(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const subscriptionId = req.params.subscription
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }

    if (!customerId || !subscriptionId ||  !req.user) {
      const err = new Error('A customer id, subscription id, and a user in session are required')
      return res.forbidden(err)
    }


    Validator.validateSubscription.addItems(req.body)
      .then(values => {
        return SubscriptionService.addItems(req.body, subscriptionId)
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
  subscriptionRemoveItems(req, res) {
    const SubscriptionService = this.app.services.SubscriptionService
    const subscriptionId = req.params.subscription

    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !subscriptionId ||  !req.user) {
      const err = new Error('A customer id, subscription id, and a user in session are required')
      return res.forbidden(err)
    }

    Validator.validateSubscription.removeItems(req.body)
      .then(values => {
        return SubscriptionService.removeItems(req.body, subscriptionId)
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
  subscriptions(req, res) {
    const Subscription = this.app.models['Subscription']
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id and a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    Subscription.findAndCountAll({
      subscription: sort,
      where: {
        customer_id: customerId
      },
      offset: offset,
      limit: limit
    })
      .then(subscriptions => {
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
  address(req, res) {
    const Address = this.app.models['Address']
    const addressId = req.params.address
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }

    if (!customerId || !addressId || !req.user) {
      const err = new Error('A customer id and a user in session are required')
      res.send(401, err)
    }

    Address.resolve(addressId)
      .then(address => {
        return this.app.services.PermissionsService.sanitizeResult(req, address)
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
  addresses(req, res) {
    const Address = this.app.models['Address']
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }

    if (!customerId && !req.user) {
      const err = new Error('A customer id and a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    Address.findAndCountAll({
      order: sort,
      include: [{
        model: this.app.models['Customer'].instance,
        attributes: [
          'id',
          'shipping_address_id',
          'billing_address_id',
          'default_address_id'
        ],
        where: {
          id: customerId
        }
      }],
      offset: offset,
      limit: limit
    })
      .then(addresses => {
        // Paginate
        res.paginate(addresses.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, addresses.rows)
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
  addAddress(req, res) {
    const CustomerService = this.app.services.CustomerService
    let customerId = req.params.id
    const addressId = req.params.address

    let type = null
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }

    if (!customerId) {
      const err = new Error('A customer id is required')
      return res.serverError(err)
    }

    if (!req.body.customer) {
      req.body.customer = {}
    }
    if (!req.body.address) {
      req.body.address = {}
    }
    if (req.body.shipping_address) {
      type = 'shipping'
      req.body.address = req.body.shipping_address
      delete req.body.shipping_address
    }
    else if (req.body.billing_address) {
      type = 'billing'
      req.body.address = req.body.billing_address
      delete req.body.billing_address
    }
    else if (req.body.default_address) {
      type = 'default'
      req.body.address = req.body.default_address
      delete req.body.default_address
    }

    // If an addressId param was passed, set it as the id
    if (addressId) {
      req.body.address.id = addressId
    }

    // Set body variables just in case
    req.body.customer.id = customerId

    Validator.validateAddress.add(req.body.address)
      .then(values => {
        return CustomerService.addAddress(req.body.customer, req.body.address, type)
      })
      .then(address => {
        return this.app.services.PermissionsService.sanitizeResult(req, address)
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
  // TODO, resolve the address by id or token
  updateAddress(req, res) {
    const CustomerService = this.app.services.CustomerService
    const addressId = req.params.address
    let customerId = req.params.id
    let type = null

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }

    if (!customerId || !addressId) {
      const err = new Error('A customer id, and an address id are required')
      return res.serverError(err)
    }

    if (!req.body.customer) {
      req.body.customer = {}
    }
    if (!req.body.address) {
      req.body.address = {}
    }

    if (req.body.shipping_address) {
      type = 'shipping'
      req.body.address = req.body.shipping_address
      delete req.body.shipping_address
    }
    else if (req.body.billing_address) {
      type = 'billing'
      req.body.address = req.body.billing_address
      delete req.body.billing_address
    }
    else if (req.body.default_address) {
      type = 'default'
      req.body.address = req.body.default_address
      delete req.body.default_address
    }

    // Set body variables just in case
    req.body.customer.id = customerId

    if (addressId) {
      req.body.address.id = addressId
    }

    Validator.validateAddress.update(req.body.address)
      .then(values => {
        return CustomerService.updateAddress(req.body.customer, req.body.address, type)
      })
      .then(address => {
        return this.app.services.PermissionsService.sanitizeResult(req, address)
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
  destroyAddress(req, res) {
    const CustomerService = this.app.services.CustomerService
    const addressId = req.params.address
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !addressId) {
      const err = new Error('A customer id, and address id are required')
      return res.serverError(err)
    }
    if (!req.body.customer) {
      req.body.customer = {}
    }
    if (!req.body.address) {
      req.body.address = {}
    }

    // Set body variables just in case
    req.body.customer.id = customerId

    if (addressId) {
      req.body.address.id = addressId
    }

    Validator.validateAddress.remove(req.body.address)
      .then(values => {
        return CustomerService.removeAddress(req.body.customer, req.body.address)
      })
      .then(address => {
        return this.app.services.PermissionsService.sanitizeResult(req, address)
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
  source(req, res) {
    const Source = this.app.models['Source']
    const sourceId = req.params.source
    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !sourceId || !req.user) {
      const err = new Error('A customer id and a user in session are required')
      res.send(401, err)

    }
    Source.resolve(sourceId)
      .then(source => {
        return this.app.services.PermissionsService.sanitizeResult(req, source)
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
  sources(req, res) {
    const Source = this.app.models['Source']
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id and a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    Source.findAndCountAll({
      order: sort,
      where: {
        customer_id: customerId
      },
      offset: offset,
      limit: limit
    })
      .then(sources => {
        // Paginate
        res.paginate(sources.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, sources.rows)
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
  addSource(req, res) {
    const CustomerService = this.app.services.CustomerService
    // const source = req.params.source
    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !req.user) {
      const err = new Error('A customer id and a user in session are required')
      return res.serverError(err)
    }
    if (!req.body.customer) {
      req.body.customer = {}
    }
    req.body.customer.id = customerId
    // req.body.source.id = source

    Validator.validateSource.add(req.body.source)
      .then(values => {
        return CustomerService.createCustomerSource(req.body.customer, req.body.source)
      })
      .then(source => {
        return this.app.services.PermissionsService.sanitizeResult(req, source)
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
  updateSource(req, res) {
    const CustomerService = this.app.services.CustomerService
    const sourceId = req.params.source
    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !req.user || !sourceId) {
      const err = new Error('A customer id, source id, and a user in session are required')
      return res.serverError(err)
    }
    if (!req.body.customer) {
      req.body.customer = {}
    }
    if (!req.body.source) {
      req.body.source = {}
    }

    // Set body variables just in case
    req.body.customer.id = customerId
    if (isString(sourceId)) {
      req.body.source.token = sourceId
    }
    if (isNumber(sourceId)) {
      req.body.source.id = sourceId
    }

    Validator.validateSource.add(req.body.source)
      .then(values => {
        return CustomerService.updateCustomerSource(req.body.customer, req.body.source, req.body.source)
      })
      .then(source => {
        return this.app.services.PermissionsService.sanitizeResult(req, source)
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
  destroySource(req, res) {
    const CustomerService = this.app.services.CustomerService
    const sourceId = req.params.source
    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !req.user || !sourceId) {
      const err = new Error('A customer id, source id, and a user in session are required')
      return res.serverError(err)
    }
    if (!req.body.customer) {
      req.body.customer = {}
    }
    if (!req.body.source) {
      req.body.source = {}
    }

    // Set body variables just in case
    req.body.customer.id = customerId
    if (isString(sourceId)) {
      req.body.source.token = sourceId
    }
    if (isNumber(sourceId)) {
      req.body.source.id = sourceId
    }

    Validator.validateSource.remove(req.body.source)
      .then(values => {
        return CustomerService.removeCustomerSource(req.body.customer, req.body.source)
      })
      .then(source => {
        return this.app.services.PermissionsService.sanitizeResult(req, source)
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
  user(req, res) {
    const User = this.app.models['User']
    const userId = req.params.user
    let customerId = req.params.id
    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId || !userId || !req.user) {
      const err = new Error('A customer id and a user in session are required')
      res.send(401, err)

    }
    User.findById(userId)
      .then(user => {
        return this.app.services.PermissionsService.sanitizeResult(req, user)
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
  users(req, res) {
    const User = this.app.models['User']
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id or a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    User.findAndCountAll({
      // TODO fix for sqlite
      // order: sort,
      where: {
        '$customers.id$': customerId
      },
      include: [{
        model: this.app.models['Customer'].instance,
        as: 'customers',
        attributes: ['id']
      }],
      offset: offset
      // TODO sequelize breaks if limit is set here
      // limit: limit
    })
      .then(users => {
        // Paginate
        res.paginate(users.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, users.rows)
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
  addUser(req, res) {
    let customerId = req.params.id
    let userId = req.params.user

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id or a user in session are required')
      return res.send(401, err)
    }

    const CustomerService = this.app.services.CustomerService
    CustomerService.addUser(customerId, userId)
      .then(user => {
        return this.app.services.PermissionsService.sanitizeResult(req, user)
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
  addUsers(req, res) {
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id or a user in session are required')
      return res.send(401, err)
    }

    const CustomerService = this.app.services.CustomerService
    CustomerService.addUsers(customerId, req.body)
      .then(users => {
        return this.app.services.PermissionsService.sanitizeResult(req, users)
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
  removeUser(req, res) {
    let customerId = req.params.id
    let userId = req.params.user

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id or a user in session are required')
      return res.send(401, err)
    }

    const CustomerService = this.app.services.CustomerService
    CustomerService.removeUser(customerId, userId)
      .then(user => {
        return this.app.services.PermissionsService.sanitizeResult(req, user)
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
  addTag(req, res) {
    const CustomerService = this.app.services.CustomerService
    CustomerService.addTag(req.params.id, req.params.tag)
      .then(tag => {
        return this.app.services.PermissionsService.sanitizeResult(req, tag)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  tags(req, res) {
    const Tag = this.app.models['Tag']
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id or a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    Tag.findAndCountAll({
      // TODO fix for sqlite
      include: [{
        model: this.app.models['Customer'].instance,
        as: 'customers',
        attributes: ['id'],
        where: {
          id: customerId
        }
      }],
      offset: offset,
      // TODO sequelize breaks if limit is set here
      limit: limit,
      order: sort
    })
      .then(tags => {
        // Paginate
        res.paginate(tags.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, tags.rows)
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
  removeTag(req, res) {
    const CustomerService = this.app.services.CustomerService
    CustomerService.removeTag(req.params.id, req.params.tag)
      .then(tag => {
        return this.app.services.PermissionsService.sanitizeResult(req, tag)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   * add a customer to a collection
   * @param req
   * @param res
   */
  addCollection(req, res) {
    const CustomerService = this.app.services.CustomerService
    CustomerService.addCollection(req.params.id, req.params.collection)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   * add a customer to a collection
   * @param req
   * @param res
   */
  addCollections(req, res) {
    const CustomerService = this.app.services.CustomerService
    CustomerService.addCollections(req.params.id, req.body)
      .then(collections => {
        return this.app.services.PermissionsService.sanitizeResult(req, collections)
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
  collections(req, res) {
    const Collection = this.app.models['Collection']
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id or a collection in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    Collection.findAndCountAll({
      // TODO fix for sqlite
      include: [{
        model: this.app.models['Customer'].instance,
        as: 'customers',
        attributes: ['id'],
        where: {
          id: customerId
        }
      }],
      offset: offset,
      // TODO sequelize breaks if limit is set here
      limit: limit,
      order: sort
    })
      .then(collections => {
        // Paginate
        res.paginate(collections.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, collections.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   * remove a customer from a collection
   * @param req
   * @param res
   */
  removeCollection(req, res) {
    const CustomerService = this.app.services.CustomerService
    CustomerService.removeCollection(req.params.id, req.params.collection)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
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
  discounts(req, res) {
    const Discount = this.app.models['Discount']
    const customerId = req.params.id
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    if (!customerId) {
      const err = new Error('A customer id is required')
      return res.send(401, err)
    }

    Discount.findAndCountAll({
      include: [
        {
          model: this.app.models['Customer'].instance,
          as: 'customers',
          where: {
            id: customerId
          }
        }
      ],
      order: sort,
      offset: offset,
      limit: limit
    })
      .then(discounts => {
        // Paginate
        res.paginate(discounts.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, discounts.rows)
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
  event(req, res) {
    const Event = this.app.models['Event']
    const eventId = req.params.event
    const customerId = req.params.id

    if (!customerId || !eventId || !req.user) {
      const err = new Error('A customer id and a user in session are required')
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
    const customerId = req.params.id

    if (!customerId && !req.user) {
      const err = new Error('A customer id and a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    Event.findAndCountAll({
      order: sort,
      where: {
        object_id: customerId,
        object: 'customer'
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

  /**
   *
   * @param req
   * @param res
   */
  destroyEvent(req, res) {
    const Event = this.app.models['Event']
    const eventId = req.params.event
    const customerId = req.params.id

    if (!customerId || !eventId || !req.user) {
      const err = new Error('A customer id and a user in session are required')
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
  reviews(req, res) {
    const Review = this.app.models['Review']
    const customerId = req.params.id

    if (!customerId) {
      const err = new Error('A customer id is required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    Review.findAndCountAll({
      order: sort,
      where: {
        customer_id: customerId
      },
      offset: offset,
      limit: limit
    })
      .then(reviews => {
        // Paginate
        res.paginate(reviews.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, reviews.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  hasPurchasedProduct(req, res) {
    if (!req.customer) {
      const err = new Error('A customer must be logged in')
      return res.send(401, err)
    }
    const product = req.params.product

    this.app.models['Product'].resolve(product)
      .then(resProduct => {
        return resProduct.hasPurchaseHistory(req.customer.id)
      })
      .then(result => {
        return res.json({has_purchase_history: result})
      })
      .catch(err => {
        return res.serverError(err)
      })

  }

  isSubscribedToProduct(req, res) {
    if (!req.customer) {
      const err = new Error('A customer must be logged in')
      return res.send(401, err)
    }
    const product = req.params.product

    this.app.models['Product'].resolve(product)
      .then(resProduct => {
        return resProduct.isSubscribed(req.customer.id)
      })
      .then(result => {
        return res.json({is_subscribed: result})
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
  enable(req, res) {
    const CustomerService = this.app.services.CustomerService
    CustomerService.enable(req.params.id)
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
   *
   * @param req
   * @param res
   */
  disable(req, res) {
    const CustomerService = this.app.services.CustomerService
    CustomerService.disable(req.params.id)
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
   * add a customer to a customer
   * @param req
   * @param res
   */
  addCustomer(req, res) {
    // TODO check that user can perform this operation
    let customerId = req.params.id

    if (!customerId || !req.user) {
      const err = new Error('A customer id or a customer in session are required')
      return res.send(401, err)
    }

    const CustomerService = this.app.services.CustomerService
    CustomerService.addCustomer(customerId, req.params.customer)
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
   * add a customer to a customer
   * @param req
   * @param res
   */
  addCustomers(req, res) {
    // TODO check that user can perform this operation
    let customerId = req.params.id

    if (!customerId || !req.user) {
      const err = new Error('A customer id or a customer in session are required')
      return res.send(401, err)
    }

    const CustomerService = this.app.services.CustomerService
    CustomerService.addCustomers(customerId, req.body)
      .then(customers => {
        return this.app.services.PermissionsService.sanitizeResult(req, customers)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   * retuns a list of customers of a customer
   * @param req
   * @param res
   */
  customers(req, res) {
    // TODO check that user can perform this operation

    const Customer = this.app.models['Customer']
    let customerId = req.params.id

    if (!customerId && req.user) {
      customerId = req.user.current_customer_id
    }
    if (!customerId && !req.user) {
      const err = new Error('A customer id or a customer in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    const ItemCustomer = this.app.models['ItemCustomer']

    let count = 0

    Customer.resolve(customerId, {
      attributes: ['id']
    })
      .then(_customer => {

        return ItemCustomer.findAndCountAll({
          where: {
            customer_id: _customer.id,
            model: 'customer'
          },
          attributes: ['model_id'],
          limit: limit,
          offset: offset
        })
      })
      .then(arr => {
        count = arr.count
        const customerIds = arr.rows.map(model => model.model_id)
        return Customer.findAll({
          where: {
            id: customerIds
          }
        })
      })
      .then(customers => {
        // Paginate
        res.paginate(count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, customers)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
    // Customer.findAndCountAll({
    //   // TODO fix for sqlite
    //   include: [{
    //     model: this.app.models['Customer'].instance,
    //     as: 'customers',
    //     attributes: ['id'],
    //     where: {
    //       id: customerId
    //     }
    //   }],
    //   offset: offset,
    //   // TODO sequelize breaks if limit is set here
    //   limit: limit,
    //   order: sort
    // })
    //   .then(customers => {
    //     // Paginate
    //     res.paginate(customers.count, limit, offset, sort)
    //     return this.app.services.PermissionsService.sanitizeResult(req, customers.rows)
    //   })
    //   .then(result => {
    //     return res.json(result)
    //   })
    //   .catch(err => {
    //     return res.serverError(err)
    //   })
  }
  /**
   * remove a customer from a customer
   * @param req
   * @param res
   */
  removeCustomer(req, res) {

    let customerId = req.params.id

    if (!customerId || !req.user) {
      const err = new Error('A customer id or a customer in session are required')
      return res.send(401, err)
    }

    const CustomerService = this.app.services.CustomerService
    CustomerService.removeCustomer(customerId, req.params.customer)
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
   * remove customers from a customer
   * @param req
   * @param res
   */
  removeCustomers(req, res) {
    let customerId = req.params.id

    if (!customerId || !req.user) {
      const err = new Error('A customer id or a customer in session are required')
      return res.send(401, err)
    }

    const CustomerService = this.app.services.CustomerService
    CustomerService.removeCustomers(customerId, req.body)
      .then(customers => {
        return this.app.services.PermissionsService.sanitizeResult(req, customers)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
}
