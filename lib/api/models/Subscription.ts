import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { defaultsDeep, isObject, isNumber, isString, findIndex, values, merge } from 'lodash'

import * as moment from 'moment'
import { Subscription as SubscriptionQuery } from '../utils/queryDefaults'
import { INTERVALS } from '../../enums'
import { SUBSCRIPTION_CANCEL } from '../../enums'
import { DISCOUNT_STATUS } from '../../enums'
import { PAYMENT_PROCESSING_METHOD } from '../../enums'

// tslint:disable:no-shadowed-variable
export class SubscriptionResolver extends SequelizeResolver {
  /**
   *
   * @param criteria
   * @param options
   * @returns {*|Promise.<Instance>}
   */
  findByIdDefault(criteria, options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      SubscriptionQuery.default(this.app),
      options
    )
    return this.findById(criteria, options)
  }
  /**
   *
   * @param token
   * @param options
   * @returns {*|Promise.<Instance>}
   */
  findByTokenDefault(token, options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      SubscriptionQuery.default(this.app),
      options,
      {
        where: {
          token: token
        }
      }
    )
    return this.findOne(options)
  }

  /**
   * Batch Edit Subscriptions
   */
  batch(options, batch) {
    const self = this

    options.limit = options.limit || 100
    options.offset = options.offset || 0
    options.regressive = options.regressive || false

    const recursiveQuery = function(options) {
      let count = 0
      return self.findAndCountAll(options)
        .then(results => {
          count = results.count
          return batch(results.rows)
        })
        .then(batched => {
          if (count >= (options.regressive ? options.limit : options.offset + options.limit)) {
            options.offset = options.regressive ? 0 : options.offset + options.limit
            return recursiveQuery(options)
          }
          else {
            return Promise.resolve()
          }
        })
    }
    return recursiveQuery(options)
  }

  /**
   * Resolve by instance Function
   * @param subscription
   * @param options
   */
  resolveByInstance (subscription, options: {[key: string]: any} = {}) {
    return Promise.resolve(subscription)
  }
  /**
   * Resolve by id Function
   * @param subscription
   * @param options
   */
  resolveById (subscription, options: {[key: string]: any} = {}) {
    return this.findById(subscription.id, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Subscription ${subscription.id} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by token Function
   * @param subscription
   * @param options
   */
  resolveByToken (subscription, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        token: subscription.token
      }
    }, options))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Subscription token ${subscription.token} not found`)
        }
        return resUser
      })
  }
  // /**
  //  * Resolve by email Function (can't do this, emails are not unique)
  //  * @param subscription
  //  * @param options
  //  */
  // resolveByEmail (subscription, options: {[key: string]: any} = {}) {
  //   return this.findOne(defaultsDeep({
  //     where: {
  //       email: subscription.email
  //     }
  //   }, options))
  //     .then(resUser => {
  //       if (!resUser && options.reject !== false) {
  //         throw new ModelError('E_NOT_FOUND', `Subscription email ${subscription.email} not found`)
  //       }
  //       return resUser
  //     })
  // }
  /**
   * Resolve by number Function
   * @param subscription
   * @param options
   */
  resolveByNumber (subscription, options: {[key: string]: any} = {}) {
    return this.findById(subscription, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Subscription ${subscription.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by string Function
   * @param subscription
   * @param options
   */
  resolveByString (subscription, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        token: subscription
      }
    }, options))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Subscription ${subscription} not found`)
        }
        return resUser
      })
  }
  /**
   * Primary Resolve Function
   * @param subscription
   * @param options
   */
  resolve(subscription, options: {[key: string]: any} = {}) {
    const resolvers = {
      'instance': subscription instanceof this.instance,
      'id': !!(subscription && isObject(subscription) && subscription.id),
      'token': !!(subscription && isObject(subscription) && subscription.token),
      // 'email': !!(subscription && isObject(subscription) && subscription.email),
      'number': !!(subscription && isNumber(subscription)),
      'string': !!(subscription && isString(subscription))
    }
    const type = Object.keys(resolvers).find((key) => resolvers[key])

    switch (type) {
      case 'instance': {
        return this.resolveByInstance(subscription, options)
      }
      case 'id': {
        return this.resolveById(subscription, options)
      }
      case 'token': {
        return this.resolveByToken(subscription, options)
      }
      // case 'email': {
      //   return this.resolveByEmail(subscription, options)
      // }
      case 'number': {
        return this.resolveByNumber(subscription, options)
      }
      case 'string': {
        return this.resolveByString(subscription, options)
      }
      default: {
        // TODO create proper error
        const err = new Error(`Unable to resolve Subscription ${subscription}`)
        return Promise.reject(err)
      }
    }
  }
}

/**
 * @module Subscription
 * @description Subscription Model
 */
export class Subscription extends Model {

  static get resolver() {
    return SubscriptionResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          INTERVALS: INTERVALS,
          SUBSCRIPTION_CANCEL: SUBSCRIPTION_CANCEL
        },
        // defaultScope: {
        //   where: {
        //     live_mode: app.config.get('engine.live_mode')
        //   }
        // },
        scopes: {
          live: {
            where: {
              live_mode: true
            }
          },
          active: {
            where: {
              active: true
            }
          },
          deactivated: {
            where: {
              active: false,
              cancelled: false
            }
          },
          cancelled: {
            where: {
              cancelled: true
            }
          }
        },
        indexes: [
          // Creates a gin index on data with the jsonb_path_ops operator
          {
            fields: ['line_items'],
            using: 'gin',
            operator: 'jsonb_path_ops'
          }
        ],
        hooks: {
          beforeCreate: [
            (subscription, options) => {
              return app.services.SubscriptionService.beforeCreate(subscription)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          beforeUpdate: [
            (subscription, options) => {
              return app.services.SubscriptionService.beforeUpdate(subscription)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          afterCreate: [
            (subscription, options) => {
              return app.services.SubscriptionService.afterCreate(subscription, options)
                .then(subscription => {
                  return subscription.save({transaction: options.transaction || null})
                })
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          afterUpdate: [
            (subscription, options) => {
              return app.services.SubscriptionService.afterCreate(subscription, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ]
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // Unique identifier for a particular subscription.
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      // The id of the Shop that created this subscription
      shop_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Shop',
        //   key: 'id'
        // }
      },
      // The Order that generated this subscription
      original_order_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Order',
        //   key: 'id'
        // },
        // Have to allow null so that these can be created without an order
        // allowNull: true
      },
      // The Order that generated this subscription
      last_order_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Order',
        //   key: 'id'
        // },
        // Have to allow null so that these can be created without an order
        // allowNull: true
      },
      customer_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Customer',
        //   key: 'id'
        // },
        allowNull: false
      },
      email: {
        type: Sequelize.STRING
      },
      // The interval of the subscription, defaults to 0 months
      interval: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The unit of the interval
      unit: {
        type: Sequelize.ENUM,
        values: values(INTERVALS),
        defaultValue: INTERVALS.MONTH
      },
      // Active Subscription
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      // The date time that the subscription was last renewed at
      renewed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      // The next date time subscription will renew on
      renews_on: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      total_renewals: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      renew_retry_at: {
        type: Sequelize.DATE
      },
      total_renewal_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The reason why the subscription was cancelled. If the subscription was not cancelled, this value is "null."
      // cancelled Subscription
      cancelled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      cancel_reason: {
        type: Sequelize.ENUM,
        values: values(SUBSCRIPTION_CANCEL)
      },
      cancelled_at: {
        type: Sequelize.DATE
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD'
      },
      line_items: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Subscription', app, Sequelize, 'line_items', {
      //   defaultValue: []
      // }),
      subtotal_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The line_items that have discounts
      discounted_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Subscription', app, Sequelize, 'discounted_lines', {
      //   defaultValue: []
      // }),
      // The line_items that have discounts
      coupon_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Subscription', app, Sequelize, 'coupon_lines', {
      //   defaultValue: []
      // }),
      // The line_items that require shipping
      shipping_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Subscription', app, Sequelize, 'shipping_lines', {
      //   defaultValue: []
      // }),
      // If the cost of shipping is included
      shipping_included: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // An array of selected shipping_rates
      shipping_rate: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Subscription', app, Sequelize, 'shipping_rate', {
      //   defaultValue: []
      // }),
      // An array of shipping_rate objects, each of which details the shipping methods available.
      shipping_rates: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Subscription', app, Sequelize, 'shipping_rates', {
      //   defaultValue: []
      // }),
      // If this subscription contains an item that requires shipping
      has_shipping: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // If this subscription contains an item that requires taxes
      has_taxes: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // Total quantity of items in the subscription
      total_items: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // If shipping should be taxed
      tax_shipping: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // The line_items that have taxes
      tax_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Subscription', app, Sequelize, 'tax_lines', {
      //   defaultValue: []
      // }),
      // The rate at which taxes are applied
      tax_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      // The rate as a percentage at which taxes are applies
      tax_percentage: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      // True when taxes are included in the subtotal_price
      taxes_included: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // The total amount of discounts applied
      total_discounts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount of coupons applies
      total_coupons: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total original price of the line items
      total_line_items_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Array of pricing overrides objects
      pricing_overrides: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Subscription', app, Sequelize, 'pricing_overrides', {
      //   defaultValue: []
      // }),
      // USER id of the admin who did the override
      pricing_override_id: {
        type: Sequelize.INTEGER
      },
      // The total monetary amount of pricing overrides
      total_overrides: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The sum of all the prices of all the items in the checkout, taxes and discounts included.
      total_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The amount left to be paid. This is equal to the cost of the line items, taxes and shipping minus discounts and gift cards.
      total_due: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The sum of all the Shipping costs
      total_shipping: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The sum of all the taxes applied to the line items in the checkout.
      total_tax: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total weight of the cart
      total_weight: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      // If a renewal notice was sent
      notice_sent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      // When the renewal notice was sent
      notice_sent_at: {
        type: Sequelize.DATE
      },

      // Live Mode
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('engine.live_mode')
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    // The customer this subscription belongs to
    models.Subscription.belongsTo(models.Customer, {
      // as: 'customer_id'
    })
    models.Subscription.belongsTo(models.Shop, {
      // as: 'customer_id'
    })
    // // The Shop that originated this order
    // models.Subscription.belongsTo(models.Shop, {
    //   // as: 'shop_id'
    // })
    // The Order that Created this Subscription
    models.Subscription.belongsTo(models.Order, {
      as: 'original_order'
    })
    // The latest order that this subscription created.
    models.Subscription.belongsTo(models.Order, {
      as: 'last_order'
    })
    // The collection of subscriptions for a given customer
    models.Subscription.belongsToMany(models.Collection, {
      as: 'collections',
      through: {
        model: models.ItemCollection,
        unique: false,
        scope: {
          model: 'subscription'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })
    models.Subscription.hasMany(models.Event, {
      as: 'events',
      foreignKey: 'object_id',
      scope: {
        object: 'subscription'
      },
      constraints: false
    })
    models.Subscription.hasMany(models.OrderItem, {
      as: 'order_items',
      foreignKey: 'subscription_id'
    })
    models.Subscription.belongsToMany(models.Discount, {
      as: 'discounts',
      through: {
        model: models.ItemDiscount,
        unique: false,
        scope: {
          model: 'subscription'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })
  }
}

export interface Subscription {
  activate(): any
  resolveCustomer(options): any
  resolveDiscounts(options): any
  resolveLastOrder(options): any
  resolveOriginalOrder(options): any
  notifyCustomer(preNotification, options): any
  resetDefaults(): any
  setLineProperties(line): any
  setLineItems(lines): any
  setItemDiscountedLines(item, discount, criteria): any
  setItemsDiscountedLines(discounts, criteria): any
  setDiscountedLines(lines): any
  setPricingOverrides(lines): any
  setCouponLines(lines): any
  setItemsShippingLines(items): any
  setShippingLines(lines): any
  setItemsTaxLines(items): any
  setTaxLines(lines): any
  setTotals(): any
  line(data): any
  addLine(item, qty, properties, options): any
  removeLine(item, qty): any
  renew(): any
  willRenew(): any
  retry(): any
  sendActivateEmail(options): any
  sendCancelledEmail(options): any
  sendDeactivateEmail(options): any
  sendFailedEmail(options): any
  sendRenewedEmail(options): any
  sendUpdatedEmail(options): any
  sendWillRenewEmail(options): any
  buildOrder(data): any
  calculateDiscounts(options): any
  getCollectionPairs(options): any
  calculateTaxes(options): any
  recalculate(options): any
}


Subscription.prototype.activate = function() {
  this.cancel_reason = null
  this.cancelled_at = null
  this.cancelled = false
  this.active = true

  // TODO, this may also need to trigger a new order
  // Check if the dates need to be updated
  const d = moment().startOf('hour')
  const r = d.clone()
  if (this.unit === INTERVALS.DAY) {
    // d.setDate(d.getDay() + this.interval)
    d.add(this.interval, 'day')
  }
  else if (this.unit === INTERVALS.WEEK) {
    // d.setMonth(d.getWeek() + this.interval);
    d.add(this.interval, 'week')
  }
  else if (this.unit === INTERVALS.MONTH) {
    // d.setMonth(d.getMonth() + this.interval)
    d.add(this.interval, 'month')
  }
  else if (this.unit === INTERVALS.BIMONTH) {
    d.add(this.interval * 2, 'month')
    // d.setMonth(d.getMonth() + this.interval * 2)
  }
  else if (this.unit === INTERVALS.YEAR) {
    d.add(this.interval, 'year')
    // d.setYear(d.getYear() + this.interval)
  }
  else if (this.unit === INTERVALS.BIYEAR) {
    d.add(this.interval * 2, 'year')
    // d.setYear(d.getYear() + this.interval * 2)
  }
  // Reset Renews on date
  if (moment() > moment(this.renews_on)) {
    this.renewed_at = r.format('YYYY-MM-DD HH:mm:ss')
    this.renews_on = d.format('YYYY-MM-DD HH:mm:ss')
  }

  return this
}

/**
 *
 */
Subscription.prototype.resolveCustomer = function(options: {[key: string]: any} = {}) {
  if (
    this.Customer
    && this.Customer instanceof this.app.models['Customer'].instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  // A subscription always requires a customer, but just in case.
  else if (!this.customer_id) {
    return Promise.resolve(this)
  }
  else {
    return this.getCustomer({transaction: options.transaction || null})
      .then(_customer => {
        _customer = _customer || null
        this.Customer = _customer
        this.setDataValue('Customer', _customer)
        this.set('Customer', _customer)
        return this
      })
  }
},
/**
 *
 * @param options
 * @returns {Promise.<T>}
 */
Subscription.prototype.resolveDiscounts = function(options: {[key: string]: any} = {}) {
  if (
    this.discounts
    && this.discounts.length > 0
    && this.discounts.every(d => d instanceof this.app.models['Discount'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getDiscounts({transaction: options.transaction || null})
      .then(_discounts => {
        _discounts = _discounts || []
        this.discounts = _discounts
        this.setDataValue('discounts', _discounts)
        this.set('discounts', _discounts)
        return this
      })
  }
}
/**
 *
 */
Subscription.prototype.resolveLastOrder = function(options: {[key: string]: any} = {}) {
  if (
    this.last_order
    && this.last_order instanceof this.app.models['Order'].instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  // A subscription always requires a customer, but just in case.
  else if (!this.last_order_id) {
    return Promise.resolve(this)
  }
  else {
    return this.getLast_order({transaction: options.transaction || null})
      .then(_order => {
        _order = _order || null
        this.last_order = _order
        this.setDataValue('last_order', _order)
        this.set('last_order', _order)
        return this
      })
  }
}

/**
 *
 */
Subscription.prototype.resolveOriginalOrder = function(options: {[key: string]: any} = {}) {
  if (
    this.original_order
    && this.original_order instanceof this.app.models['Order'].instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  // A subscription always requires a customer, but just in case.
  else if (!this.original_order_id) {
    return Promise.resolve(this)
  }
  else {
    return this.getOriginal_order({transaction: options.transaction || null})
      .then(_order => {
        _order = _order || null
        this.original_order = _order
        this.setDataValue('original_order', _order)
        this.set('original_order', _order)
        return this
      })
  }
}
/**
 *
 */
Subscription.prototype.notifyCustomer = function(preNotification, options: {[key: string]: any} = {}) {
  if (this.customer_id) {
    return this.resolveCustomer({
      attributes: ['id', 'email', 'company', 'first_name', 'last_name', 'full_name'],
      transaction: options.transaction || null,
      reload: options.reload || null
    })
      .then(() => {
        if (this.Customer && this.Customer instanceof this.app.models['Customer'].instance) {
          return this.Customer.notifyUsers(preNotification, {transaction: options.transaction || null})
        }
        else {
          return
        }
      })
      .then(() => {
        return this
      })
  }
  else {
    return Promise.resolve(this)
  }
}

/**
 *
 */
Subscription.prototype.resetDefaults = function() {
  this.total_items = 0
  this.total_shipping = 0
  this.subtotal_price = 0
  this.total_discounts = 0
  this.total_coupons = 0
  this.total_tax = 0
  this.total_weight = 0
  this.total_line_items_price = 0
  this.total_overrides = 0
  this.total_price = 0
  this.total_due = 0

  this.has_shipping = false
  this.has_taxes = false
  this.discounted_lines = []
  this.coupon_lines = []
  this.shipping_lines = []
  this.tax_lines = []

  // Reset line items
  this.line_items.map(item => {
    item.shipping_lines = []
    item.discounted_lines = []
    item.coupon_lines = []
    item.tax_lines = []
    item.total_discounts = 0
    item.calculated_price = item.price
    return item
  })

  return this
}

/**
 *
 */
Subscription.prototype.setLineProperties = function(line) {
  if (line.properties) {
    for (const l in line.properties) {
      if (line.properties.hasOwnProperty(l)) {
        line.price = line.price + line.properties[l].price
        line.price_per_unit = line.price_per_unit + line.properties[l].price
      }
    }
  }
  return line
}
/**
 *
 */
Subscription.prototype.setLineItems = function(lines) {
  this.line_items = lines || []

  this.total_items = 0
  this.subtotal_price = 0
  this.total_line_items_price = 0

  this.line_items.forEach(item => {
    // Check if at least one time requires shipping
    if (item.requires_shipping) {
      this.total_weight = this.total_weight + item.grams
      this.has_shipping = true
    }

    // Check if at least one item requires taxes
    if (item.requires_taxes) {
      this.has_taxes = true
    }

    this.total_items = this.total_items + item.quantity
    this.subtotal_price = this.subtotal_price + item.price // * item.quantity
    this.total_line_items_price = this.total_line_items_price + item.price // * item.quantity
  })

  return this.setTotals()
}
/**
 *
 */
Subscription.prototype.setItemDiscountedLines = function(item, discount, criteria) {
  if (!(discount instanceof this.app.models['Discount'].instance)) {
    throw new Error('setItemDiscountedLines expects discount parameter to be a Discount Instance')
  }
  item = discount.discountItem(item, criteria)
  return item
}
/**
 *
 */
Subscription.prototype.setItemsDiscountedLines = function (discounts, criteria) {
  // Make this an array if null
  discounts = discounts || []
  // Make this an array if null
  criteria = criteria || []

  // Make this an array if null
  this.line_items = this.line_items || []

  // Set this to the default
  this.discounted_lines = []

  // Holds the final factored results
  const factoredDiscountedLines = []
  // Holds list of all discount objects being tried
  let discountsArr = []
  // Holds list lines and their discounts
  let discountedLines = []


  // For each item run the normal discounts
  this.line_items = this.line_items.map((item, index) => {
    discounts.forEach(discount => {
      item = this.setItemDiscountedLines(item, discount, criteria)
    })

    if (item.discounted_lines.length > 0) {
      const i = discountedLines.findIndex(line => line.line === index)
      if (i > -1) {

        discountedLines[i].discounts = [...discountedLines[i].discounts, ...item.discounted_lines]
      }
      else {
        discountedLines.push({
          line: index,
          discounts: item.discounted_lines
        })
      }
    }
    return item
  })

  // Gather all discounts into a single array
  discountedLines.forEach(line => {
    discountsArr = [...discountsArr, ...line.discounts.map(d => d.id)]
  })

  // Check rules
  discountedLines = discountedLines.map(line => {
    line.discounts = line.discounts.map(discount => {
      // Applies once Rule
      if (discount.rules.applies_once && discountsArr.filter(d => d === discount.id).length > 1) {
        const arrRemove = discountsArr.findIndex(d => d === discount.id)
        // Removes duplicated from discountArr
        discountsArr = discountsArr.splice(arrRemove, 1)
        // This means the next occurrence of the discount will receive the one time discount
        discount.applies = false
      }
      // Minimum Order Rule
      else if (
        discount.rules.minimum_order_amount > 0
        && this.total_line_items_price < discount.minimum_order_amount
      ) {
        discount.applies = false
      }
      // Compounding Discounts Rule
      else if (
        discount.rules.applies_compound === false && discountsArr.length > 1
      ) {
        discount.applies = false
      }
      else {
        discount.applies = true
      }
      return discount
    })
    return line
  })

  // Apply rules to line item discounts
  discountedLines.forEach(line => {
    line.discounts.forEach(discount => {
      const index = this.line_items[line.line].discounted_lines.findIndex(d => d.id === discount.id)
      this.line_items[line.line].discounted_lines[index].applies = discount.applies
    })
  })

  // Loop through items and apply discounts and factor cart discounted_lines
  this.line_items = this.line_items.map((item, index) => {
    item.discounted_lines.forEach(discountedLine => {
      if (discountedLine.applies === true) {
        // New Calculated Price
        const calculatedPrice = Math.max(0, item.calculated_price - discountedLine.price)
        // Total Deducted
        const totalDeducted = Math.min(item.calculated_price, (item.calculated_price - (item.calculated_price - discountedLine.price)))
        // Set item calculated price
        item.calculated_price = calculatedPrice
        // Set item total_discounts
        item.total_discounts = Math.min(item.price, item.total_discounts + totalDeducted)

        const fI = factoredDiscountedLines.findIndex(d => d.id === discountedLine.id)
        if (fI > -1) {
          factoredDiscountedLines[fI].lines = [...factoredDiscountedLines[fI].lines, index]
          factoredDiscountedLines[fI].price = factoredDiscountedLines[fI].price + totalDeducted
        }
        else {
          discountedLine.lines = [index]
          discountedLine.price = totalDeducted
          factoredDiscountedLines.push(discountedLine)
        }
      }
    })
    return item
  })
  return this.setDiscountedLines(factoredDiscountedLines)
}
/**
 *
 */
Subscription.prototype.setDiscountedLines = function(lines) {
  this.total_discounts = 0
  this.discounted_lines = lines || []
  this.discounted_lines.forEach(line => {
    this.total_discounts = this.total_discounts + line.price
  })
  return this.setTotals()
}

/**
 *
 */
Subscription.prototype.setPricingOverrides = function(lines) {
  this.total_overrides = 0
  this.pricing_overrides = lines || []
  this.pricing_overrides.forEach(line => {
    this.total_overrides = this.total_overrides + line.price
  })
  return this.setTotals()
},

/**
 *
 */
Subscription.prototype.setCouponLines = function(lines) {
  this.total_coupons = 0
  this.coupon_lines = lines || []
  this.coupon_lines.forEach(line => {
    this.total_coupons = this.total_coupons + line.price
  })
  return this.setTotals()
}

/**
 *
 */
Subscription.prototype.setItemsShippingLines = function (items) {
  let shippingLines = []
  let totalShipping = 0
  // Make this an array if null
  this.line_items = this.line_items || []

  this.line_items = this.line_items.map((item, i) => {
    const shippedLine = items.find(ii => ii.sku === item.sku)
    if (shippedLine) {

      shippedLine.shipping_lines = shippedLine.shipping_lines || []
      shippedLine.shipping_lines.map(line => {
        line.line = i
        return line
      })

      totalShipping = shippedLine.shipping_lines.forEach(line => {
        totalShipping = totalShipping + line.price
      })

      shippingLines = [...shippingLines, ...shippedLine.shipping_lines]
      item.shipping_lines = shippedLine.shipping_lines
      item.total_shipping = totalShipping
    }

    return item
  })
  return this.setShippingLines(shippingLines)
}

/**
 *
 */
Subscription.prototype.setShippingLines = function(lines) {
  this.total_shipping = 0
  this.shipping_lines = lines || []
  this.shipping_lines.forEach(line => {
    this.total_shipping = this.total_shipping + line.price
  })
  return this.setTotals()
}

/**
 *
 */
Subscription.prototype.setItemsTaxLines = function (items) {
  let taxesLines = []
  let totalTaxes = 0
  // Make this an array if null
  this.line_items = this.line_items || []

  this.line_items = this.line_items.map((item, i) => {
    const taxedLine = items.find(i => i.sku === item.sku)
    if (taxedLine) {

      taxedLine.tax_lines = taxedLine.tax_lines || []
      taxedLine.tax_lines.map(line => {
        line.line = i
        return line
      })

      totalTaxes = taxedLine.tax_lines.forEach(line => {
        totalTaxes = totalTaxes + line.price
      })

      taxesLines = [...taxesLines, ...taxedLine.tax_lines]
      item.tax_lines = taxedLine.tax_lines
      item.total_taxes = totalTaxes
    }

    return item
  })
  return this.setTaxLines(taxesLines)
}

/**
 *
 */
Subscription.prototype.setTaxLines = function(lines) {
  this.total_tax = 0
  this.tax_lines = lines || []
  this.tax_lines.forEach(line => {
    this.total_tax = this.total_tax + line.price
  })
  return this.setTotals()
}

/**
 *
 */
Subscription.prototype.setTotals = function() {
  // Set Cart values
  this.total_price = Math.max(0,
    this.total_tax
    + this.total_shipping
    + this.subtotal_price
  )

  this.total_due = Math.max(0,
    this.total_price
    - this.total_discounts
    - this.total_coupons
    - this.total_overrides
  )

  return this
}

Subscription.prototype.line = function(data) {
  // handle empty product
  data.Product = data.Product || {}
  data.property_pricing = data.property_pricing || data.Product.property_pricing
  data.properties = data.properties || []

  const properties = {}
  if (
    data.properties.length > 0
    && data.property_pricing
  ) {
    data.properties.forEach(prop => {
      if (!prop.name) {
        return
      }
      if (data.property_pricing[prop.name]) {
        properties[prop.name] = data.property_pricing[prop.name]
        if (prop.value) {
          properties[prop.name]['value'] = prop.value
        }
      }
    })
  }

  const line = {
    subscription_id: this.id,
    product_id: data.product_id,
    product_handle: data.Product.handle,
    variant_id: data.id || data.variant_id,
    type: data.type,
    sku: data.sku,
    title: data.Product.title,
    variant_title: data.title,
    name: data.title === data.Product.title ? data.title : `${data.Product.title} - ${data.title}`,
    properties: properties,
    pricing_properties: data.property_pricing,
    option: data.option,
    barcode: data.barcode,
    price: data.price * data.quantity,
    calculated_price: data.price * data.quantity,
    compare_at_price: data.compare_at_price,
    price_per_unit: data.price,
    currency: data.currency,
    fulfillment_service: data.fulfillment_service,
    gift_card: data.gift_card,
    requires_shipping: data.requires_shipping,
    requires_taxes: data.requires_taxes,
    tax_code: data.tax_code,
    tax_lines: [],
    total_taxes: 0,
    shipping_lines: [],
    total_shipping: 0,
    discounted_lines: [],
    // TODO handle disocunts
    total_discounts: 0,
    weight: data.weight * data.quantity,
    weight_unit: data.weight_unit,
    images: data.images.length > 0 ? data.images : data.Product.images,
    quantity: data.quantity,
    fulfillable_quantity: data.fulfillable_quantity,
    max_quantity: data.max_quantity,
    grams: this.app.services.ProxyCartService.resolveConversion(data.weight, data.weight_unit) * data.quantity,
    average_shipping: data.Product.average_shipping,
    exclude_payment_types: data.Product.exclude_payment_types,
    vendor: data.Product.vendor ? data.Product.vendor.name || data.Product.vendor : data.Product.vendor,
    live_mode: data.live_mode
  }
  return line
}

/**
 *
 */
Subscription.prototype.addLine = function(item, qty, properties, options: {[key: string]: any} = {}) {
  // The quantity available of this variant
  let lineQtyAvailable = -1
  // Check if Product is Available
  return item.checkAvailability(qty, {transaction: options.transaction || null})
    .then(availability => {
      if (!availability.allowed) {
        throw new Error(`${availability.title} is not available in this quantity, please try a lower quantity`)
      }
      lineQtyAvailable = availability.quantity
      // Check if Product is Restricted
      return item.checkRestrictions(
        this.Customer || this.customer_id,
        {transaction: options.transaction || null}
      )
    })
    .then(restricted => {
      if (restricted) {
        throw new Error(`${restricted.title} can not be delivered to ${restricted.city} ${restricted.province} ${restricted.country}`)
      }
      // Rename line items so they are no longer immutable
      const lineItems = this.line_items
      // Make quantity an integer
      if (!qty || !isNumber(qty)) {
        qty = 1
      }
      const itemIndex = findIndex(lineItems, {variant_id: item.id})
      if (itemIndex > -1) {
        this.app.log.silly('Subscription.addLine NEW QTY', lineItems[itemIndex])
        const maxQuantity = lineItems[itemIndex].max_quantity
        let calculatedQty = lineItems[itemIndex].quantity + qty

        if (maxQuantity > -1 && calculatedQty > maxQuantity) {
          calculatedQty = maxQuantity
        }

        if (lineQtyAvailable > -1 && calculatedQty > lineQtyAvailable) {
          calculatedQty = Math.max(0, lineQtyAvailable - calculatedQty)
        }

        lineItems[itemIndex].quantity = calculatedQty
        lineItems[itemIndex].fulfillable_quantity = calculatedQty

        lineItems[itemIndex] = this.setLineProperties(lineItems[itemIndex])

        this.line_items = lineItems
      }
      else {
        const maxQuantity = item.max_quantity
        let calculatedQty = qty

        if (maxQuantity > -1 && calculatedQty > maxQuantity) {
          calculatedQty = maxQuantity
        }

        if (lineQtyAvailable > -1 && calculatedQty > lineQtyAvailable) {
          calculatedQty = Math.max(0, lineQtyAvailable - calculatedQty)
        }

        item.quantity = calculatedQty
        item.fulfillable_quantity = calculatedQty
        item.max_quantity = maxQuantity
        item.properties = properties
        let line = this.line(item)
        line = this.setLineProperties(line)

        this.app.log.silly('Subscription.addLine NEW LINE', line)
        lineItems.push(line)
        this.line_items = lineItems
      }
      return this
    })
}

Subscription.prototype.removeLine = function(item, qty) {
  const lineItems = this.line_items
  if (!qty || !isNumber(qty)) {
    qty = 1
  }
  const itemIndex = findIndex(lineItems, {variant_id: item.id})
  if (itemIndex > -1) {
    lineItems[itemIndex].quantity = lineItems[itemIndex].quantity - qty
    lineItems[itemIndex].fulfillable_quantity = Math.max(0, lineItems[itemIndex].fulfillable_quantity - qty)
    // Resolve Grams
    if ( lineItems[itemIndex].quantity < 1) {
      this.app.log.silly(`Cart.removeLine removing '${lineItems[itemIndex].variant_id}' line completely`)
      lineItems.splice(itemIndex, 1)
    }
    this.line_items = lineItems
    return Promise.resolve(this)
  }
}

/**
 *
 */
Subscription.prototype.renew = function() {
  this.renewed_at = new Date(Date.now())
  this.renew_retry_at = null
  this.total_renewal_attempts = 0
  this.total_renewals++

  // Active now because it was renewed
  this.active = true
  // Clear prior cancelled arguments
  this.cancelled = false
  this.cancel_reason = null
  this.cancelled_at = null

  // Clear the prior renewal notices
  this.notice_sent = false
  this.notice_sent_at = null

  return this
}

Subscription.prototype.willRenew = function() {
  this.notice_sent = true
  this.notice_sent_at = new Date(Date.now())
  return this
}
/**
 *
 * @returns Instance
 */
Subscription.prototype.retry = function() {
  this.renew_retry_at = new Date(Date.now())
  this.total_renewal_attempts++
  return this
}
/**
 *
 */
Subscription.prototype.sendActivateEmail = function(options: {[key: string]: any} = {}) {
  return this.app.emails.Subscription.activated(this, {
    send_email: this.app.config.get('cart.emails.subscriptionRenewed')
  }, {
    transaction: options.transaction || null
  })
    .then(email => {
      return this.notifyCustomer(email, {transaction: options.transaction || null})
    })
    .catch(err => {
      this.app.log.error(err)
      return
    })
}
/**
 *
 */
Subscription.prototype.sendCancelledEmail = function(options: {[key: string]: any} = {}) {
  return this.app.emails.Subscription.cancelled(this, {
    send_email: this.app.config.get('cart.emails.subscriptionCancelled')
  }, {
    transaction: options.transaction || null
  })
    .then(email => {
      return this.notifyCustomer(email, {transaction: options.transaction || null})
    })
    .catch(err => {
      this.app.log.error(err)
      return
    })
}
/**
 *
 */
Subscription.prototype.sendDeactivateEmail = function(options: {[key: string]: any} = {}) {
  return this.app.emails.Subscription.deactivated(this, {
    send_email: this.app.config.get('cart.emails.subscriptionDeactivated')
  }, {
    transaction: options.transaction || null
  })
    .then(email => {
      return this.notifyCustomer(email, {transaction: options.transaction || null})
    })
    .catch(err => {
      this.app.log.error(err)
      return
    })
}
/**
 *
 */
Subscription.prototype.sendFailedEmail = function(options: {[key: string]: any} = {}) {
  return this.app.emails.Subscription.failed(this, {
    send_email: this.app.config.get('cart.emails.subscriptionFailed')
  }, {
    transaction: options.transaction || null
  })
    .then(email => {
      return this.notifyCustomer(email, {transaction: options.transaction || null})
    })
    .catch(err => {
      this.app.log.error(err)
      return
    })
}
/**
 *
 */
Subscription.prototype.sendRenewedEmail = function(options: {[key: string]: any} = {}) {
  return this.app.emails.Subscription.renewed(this, {
    send_email: this.app.config.get('cart.emails.subscriptionRenewed')
  }, {
    transaction: options.transaction || null
  })
    .then(email => {
      return this.notifyCustomer(email, {transaction: options.transaction || null})
    })
    .catch(err => {
      this.app.log.error(err)
      return
    })
}

/**
 *
 */
Subscription.prototype.sendUpdatedEmail = function(options: {[key: string]: any} = {}) {
  return this.app.emails.Subscription.updated(this, {
    send_email: this.app.config.get('cart.emails.subscriptionUpdated')
  }, {
    transaction: options.transaction || null
  })
    .then(email => {
      return this.notifyCustomer(email, {transaction: options.transaction || null})
    })
    .catch(err => {
      this.app.log.error(err)
      return
    })
}

/**
 *
 */
Subscription.prototype.sendWillRenewEmail = function(options: {[key: string]: any} = {}) {
  return this.app.emails.Subscription.willRenew(this, {
    send_email: this.app.config.get('cart.emails.subscriptionWillRenew')
  }, {
    transaction: options.transaction || null
  })
    .then(email => {
      return this.notifyCustomer(email, {transaction: options.transaction || null})
    })
    .catch(err => {
      this.app.log.error(err)
      return
    })
}

/**
 *
 */
Subscription.prototype.buildOrder = function(data: {[key: string]: any} = {}) {
  return {
    // Request info
    client_details: data.client_details || this.client_details,
    ip: data.ip || null,
    payment_details: data.payment_details,
    payment_kind: data.payment_kind || this.app.config.get('cart.orders.payment_kind'),
    transaction_kind: data.transaction_kind || this.app.config.get('cart.orders.transaction_kind'),
    fulfillment_kind: data.fulfillment_kind || this.app.config.get('cart.orders.fulfillment_kind'),
    processing_method: data.processing_method || PAYMENT_PROCESSING_METHOD.SUBSCRIPTION,
    shipping_address: data.shipping_address || this.shipping_address,
    billing_address: data.billing_address || this.billing_address,

    // Customer Info
    customer_id: data.customer_id || this.customer_id || null,
    email: data.email || null,

    // User ID
    user_id: data.user_id || this.user_id || null,

    // Subscription Info
    subscription_token: this.token,
    currency: this.currency,
    line_items: this.line_items,
    tax_lines: this.tax_lines,
    shipping_lines: this.shipping_lines,
    discounted_lines: this.discounted_lines,
    coupon_lines: this.coupon_lines,
    subtotal_price: this.subtotal_price,
    taxes_included: this.taxes_included,
    total_discounts: this.total_discounts,
    total_coupons: this.total_coupons,
    total_line_items_price: this.total_line_items_price,
    total_price: this.total_due,
    total_due: this.total_due,
    total_tax: this.total_tax,
    total_weight: this.total_weight,
    total_items: this.total_items,
    shop_id: this.shop_id,
    has_shipping: this.has_shipping,
    has_subscription: this.has_subscription,
    has_taxes: this.has_taxes,

    // Pricing Overrides
    pricing_override_id: this.pricing_override_id,
    pricing_overrides: this.pricing_overrides || [],
    total_overrides: this.total_overrides
  }
}

/**
 *
 */
Subscription.prototype.calculateDiscounts = function(options: {[key: string]: any} = {}) {
  const criteria = []
  const productIds = this.line_items.map(item => item.product_id)
  let collectionPairs = [], discountCriteria = [], checkHistory = []

  let resDiscounts
  return Promise.resolve()
    .then(() => {
      return this.getCollectionPairs({transaction: options.transaction || null})
    })
    .then(_collections => {
      collectionPairs = _collections || []
      if (this.id) {
        criteria.push({
          model: 'cart',
          model_id: this.id
        })
      }
      if (this.customer_id) {
        criteria.push({
          model: 'customer',
          model_id: this.customer_id
        })
      }
      if (productIds.length > 0) {
        criteria.push({
          model: 'product',
          model_id: productIds
        })
      }
      if (collectionPairs.length > 0) {
        criteria.push({
          model: 'collection',
          model_id: collectionPairs.map(c => c.collection)
        })
      }
      if (criteria.length > 0) {
        return this.app.models['ItemDiscount'].findAll({
          where: {
            $or: criteria
          },
          attributes: ['discount_id', 'model', 'model_id'],
          transaction: options.transaction || null
        })
      }
      else {
        return []
      }
    })
    .then(discounts => {
      discounts.forEach(discount => {
        const i = discountCriteria.findIndex(d => d.discount === discount.discount_id)
        if (i > -1) {
          if (!discountCriteria[i][discount.model]) {
            discountCriteria[i][discount.model] = []
          }
          discountCriteria[i][discount.model].push(discount.model_id)
        }
        else {
          discountCriteria.push({
            discount: discount.discount_id,
            [discount.model]: [discount.model_id]
          })
        }
      })

      discountCriteria = discountCriteria.map(d => {
        if (d.collection) {
          d.collection.forEach(colId => {
            const i = collectionPairs.findIndex(c => c.collection = colId)
            if (i > -1) {
              d = merge(d, collectionPairs[i])
            }
          })
        }
        return d
      })

      this.app.log.debug('Subscription.calculateDiscount criteria', discountCriteria)

      if (discounts.length > 0) {
        return this.app.models['Discount'].findAll({
          where: {
            id: discounts.map(item => item.discount_id),
            status: DISCOUNT_STATUS.ENABLED
          },
          transaction: options.transaction || null
        })
      }
      else {
        return []
      }
    })
    .then(_discounts => {
      _discounts = _discounts || []

      resDiscounts = _discounts

      resDiscounts.forEach(discount => {
        if (discount.applies_once_per_customer && this.customer_id) {
          checkHistory.push(discount)
        }
      })

      if (checkHistory.length > 0) {
        return Promise.all(checkHistory.map(discount => {
          return discount.eligibleCustomer(this.customer_id, {transaction: options.transaction || null})
        }))
      }
      else {
        return []
      }
    })
    .then(_eligible => {
      _eligible = _eligible || []
      _eligible.forEach(discount => {
        const i = resDiscounts.findIndex(ii => ii.id === discount.id)
        if (i > -1) {
          resDiscounts.splice(i, 1)
        }
      })
      return this.setItemsDiscountedLines(resDiscounts, discountCriteria)
    })
    .catch(err => {
      this.app.log.error(err)
      return this
    })
}
/**
 *
 */
Subscription.prototype.getCollectionPairs = function(options: {[key: string]: any} = {}) {
  const collectionPairs = []
  const criteria = []
  let productIds = this.line_items.map(item => item.product_id)
  productIds = productIds.filter(i => i)
  let variantIds = this.line_items.map(item => item.variant_id)
  variantIds = variantIds.filter(i => i)

  return Promise.resolve()
    .then(() => {
      if (this.customer_id) {
        criteria.push({
          model: 'customer',
          model_id: this.customer_id
        })
      }

      if (productIds.length > 0) {
        criteria.push({
          model: 'product',
          model_id: productIds
        })
      }

      if (variantIds.length > 0) {
        criteria.push({
          model: 'productvariant',
          model_id: variantIds
        })
      }
      if (criteria.length > 0) {
        return this.app.models['ItemCollection'].findAll({
          where: {
            $or: criteria
          },
          attributes: ['id', 'collection_id', 'model', 'model_id'],
          transaction: options.transaction || null
        })
      }
      return []
    })
    .then(_collections => {
      _collections = _collections || []

      _collections.forEach(collection => {
        const i = collectionPairs.findIndex(c => c.id === collection.collection_id)
        if (i > -1) {
          if (!collectionPairs[i][collection.model]) {
            collectionPairs[i][collection.model] = []
          }
          collectionPairs[i][collection.model].push(collection.model_id)
        }
        else {
          collectionPairs.push({
            collection: collection.collection_id,
            [collection.model]: [collection.model_id]
          })
        }
      })

      return collectionPairs
    })
    .catch(err => {
      this.app.log.error(err)
      return []
    })
}
/**
 *
 */
Subscription.prototype.calculateTaxes = function(options: {[key: string]: any} = {}) {
  if (!this.has_taxes) {
    return Promise.resolve(this)
  }
  return this.app.services.TaxService.calculate(
    this,
    this.line_items,
    this.shipping_address,
    this.app.models['Subscription'],
    options
  )
    .then(taxesResult => {
      this.setItemsTaxLines(taxesResult.line_items)

      return this
    })
    .catch(err => {
      this.app.log.error(err)
      return this
    })
},
/**
 *
 * @returns {Promise.<T>}
 */
Subscription.prototype.recalculate = function(options: {[key: string]: any} = {}) {

  // const collections = []

  // Set Renewal Date
  const d = moment(this.renewed_at)
  if (this.unit === INTERVALS.DAY) {
    // d.setDate(d.getDay() + this.interval)
    d.add(this.interval, 'day')
  }
  else if (this.unit === INTERVALS.WEEK) {
    // d.setMonth(d.getWeek() + this.interval);
    d.add(this.interval, 'week')
  }
  else if (this.unit === INTERVALS.MONTH) {
    // d.setMonth(d.getMonth() + this.interval)
    d.add(this.interval, 'month')
  }
  else if (this.unit === INTERVALS.BIMONTH) {
    d.add(this.interval * 2, 'month')
    // d.setMonth(d.getMonth() + this.interval * 2)
  }
  else if (this.unit === INTERVALS.YEAR) {
    d.add(this.interval, 'year')
    // d.setYear(d.getYear() + this.interval)
  }
  else if (this.unit === INTERVALS.BIYEAR) {
    d.add(this.interval * 2, 'year')
    // d.setYear(d.getYear() + this.interval * 2)
  }
  this.renews_on = d.format('YYYY-MM-DD HH:mm:ss')

  this.resetDefaults()
  this.setLineItems(this.line_items)

  // // Get Subscription Collections
  // return app.services.CollectionService.subscriptionCollections(this)
  //   .then(resCollections => {
  //     collections = resCollections
  //     // Calculate taxes
  //     return app.services.TaxService.calculate(this, collections, app.models['Subscription'])
  //   })
  //   .then(() => {
  //     // Calculate Shipping and Collection shipping
  //     return app.services.ShippingService.calculate(this, collections, app.models['Subscription'])
  //   })
  //   // .then(() => {
  //   //   // Calculate Collection discounts
  //   //   return app.services.DiscountService.calculateCollections(this, collections, app.models['Subscription'])
  //   // })
  //   .then(() => {
  //     // Calculate Coupons
  //     return app.services.CouponService.calculate(this, collections, app.models['Subscription'])
  //   })
  //   .then(() => {



  return Promise.resolve()
    .then(() => {
      return this.calculateDiscounts({transaction: options.transaction || null})
    })
    .then(() => {
      return this.calculateTaxes({transaction: options.transaction || null})
    })
    .then(() => {
      return this.setTotals()
    })
    .catch(err => {
      this.app.log.error(err)
      return this
    })
}
