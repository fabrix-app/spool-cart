import { FabrixApp } from '@fabrix/fabrix'
import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { isArray, isObject, isString, isNumber, defaults, groupBy, extend, values, each, findIndex, map, filter, forEach } from 'lodash'
import * as shortId from 'shortid'

import { Order as OrderQuery } from '../utils/queryDefaults'
import { ORDER_STATUS } from '../../enums'
import { ORDER_CANCEL } from '../../enums'
import { ORDER_FINANCIAL } from '../../enums'
import { PAYMENT_KIND } from '../../enums'
import { TRANSACTION_STATUS } from '../../enums'
import { TRANSACTION_KIND } from '../../enums'
import { ORDER_FULFILLMENT } from '../../enums'
import { ORDER_FULFILLMENT_KIND } from '../../enums'
import { FULFILLMENT_STATUS } from '../../enums'
import { PAYMENT_PROCESSING_METHOD } from '../../enums'


export class OrderResolver extends SequelizeResolver {
  /**
   *
   * @param id
   * @param options
   */
  findByIdDefault (id, options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      OrderQuery.default(this.app),
      options
    )
    return this.findById(id, options)
  }
  /**
   *
   * @param token
   * @param options
   * @returns {*|Promise.<Model>}
   */
  findByTokenDefault (token, options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      OrderQuery.default(this.app),
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
   *
   * @param options
   * @returns {Promise.<{count: Integer, rows: Model[]}>}
   */
  findAndCountDefault (options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      OrderQuery.default(this.app),
      options
    )
    return this.findAndCountAll(options)
  }
  /**
   * Resolve by instance Function
   * @param order
   * @param options
   */
  resolveByInstance (order, options: {[key: string]: any} = {}) {
    return Promise.resolve(order)
  }
  /**
   * Resolve by id Function
   * @param order
   * @param options
   */
  resolveById (order, options: {[key: string]: any} = {}) {
    return this.findById(order.id, options)
      .then(resOrder => {
        if (!resOrder && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `order ${order.id} not found`)
        }
        return resOrder
      })
  }
  /**
   * Resolve by token Function
   * @param order
   * @param options
   */
  resolveByToken (order, options: {[key: string]: any} = {}) {
    return this.findOne(this.app.services.SequelizeService.mergeOptionDefaults(options, {
      where: {
        token: order.token
      }
    }))
      .then(resOrder => {
        if (!resOrder && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `order token ${order.token} not found`)
        }
        return resOrder
      })
  }
  /**
   * Resolve by number Function
   * @param order
   * @param options
   */
  resolveByNumber (order, options: {[key: string]: any} = {}) {
    return this.findById(order, options)
      .then(resOrder => {
        if (!resOrder && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `order ${order.token} not found`)
        }
        return resOrder
      })
  }
  /**
   * Resolve by string Function
   * @param order
   * @param options
   */
  resolveByString (order, options: {[key: string]: any} = {}) {
    return this.findOne(this.app.services.SequelizeService.mergeOptionDefaults(options, {
      where: {
        token: order
      }
    }))
      .then(resOrder => {
        if (!resOrder && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `order ${order} not found`)
        }
        return resOrder
      })
  }
  /**
   * Primary Resolve Function
   * @param order
   * @param options
   */
  resolve(order, options: {[key: string]: any} = {}) {
    const resolvers = {
      'instance': order instanceof this.instance,
      'id': !!(order && isObject(order) && order.id),
      'token': !!(order && isObject(order) && order.token),
      'number': !!(order && isNumber(order)),
      'string': !!(order && isString(order))
    }
    const type = Object.keys(resolvers).find((key) => resolvers[key])

    switch (type) {
      case 'instance': {
        return this.resolveByInstance(order, options)
      }
      case 'id': {
        return this.resolveById(order, options)
      }
      case 'token': {
        return this.resolveByToken(order, options)
      }
      case 'number': {
        return this.resolveByNumber(order, options)
      }
      case 'string': {
        return this.resolveByString(order, options)
      }
      default: {
        // TODO create proper error
        const err = new Error(`Unable to resolve order ${order}`)
        return Promise.reject(err)
      }
    }
  }
}

/**
 * @module Order
 * @description Order Model
 */
export class Order extends Model {

  static get resolver() {
    return OrderResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        autoSave: true,
        underscored: true,
        enums: {
          ORDER_STATUS: ORDER_STATUS,
          ORDER_CANCEL: ORDER_CANCEL,
          ORDER_FINANCIAL: ORDER_FINANCIAL,
          ORDER_FULFILLMENT: ORDER_FULFILLMENT,
          ORDER_FULFILLMENT_KIND: ORDER_FULFILLMENT_KIND,
          PAYMENT_KIND: PAYMENT_KIND,
          PAYMENT_PROCESSING_METHOD: PAYMENT_PROCESSING_METHOD,
          TRANSACTION_STATUS: TRANSACTION_STATUS,
          TRANSACTION_KIND: TRANSACTION_KIND,
          FULFILLMENT_STATUS: FULFILLMENT_STATUS,
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
          open: {
            where: {
              status: ORDER_STATUS.OPEN
            }
          },
          closed: {
            where: {
              status: ORDER_STATUS.CLOSED
            }
          },
          cancelled: {
            where: {
              status: ORDER_STATUS.CANCELLED
            }
          }
        },
        indexes: [
          // Creates a gin index on data with the jsonb_path_ops operator
          {
            fields: ['client_details'],
            using: 'gin',
            operator: 'jsonb_path_ops'
          }
        ],
        hooks: {
          beforeCreate: [
            (order, options) => {
              if (order.ip) {
                order.create_ip = order.ip
              }
              if (!order.token) {
                order.token = `order_${shortId.generate()}`
              }
            }
          ],
          afterCreate: [
            (order, options) => {
              return app.services.OrderService.afterCreate(order, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          beforeUpdate: [
            (order, options) => {
              if (order.ip) {
                order.update_ip = order.ip
              }
              // order.setStatus()
              if (order.changed('status') && order.status === ORDER_STATUS.CLOSED) {
                order.close()
              }
            }
          ],
          afterUpdate: [
            (order, options) => {
              return app.services.OrderService.afterUpdate(order, options)
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
      // Unique identifier for a particular order.
      token: {
        type: Sequelize.STRING,
        unique: true
      },

      // Unique identifier for a particular cart that is attached to a particular order.
      cart_token: {
        type: Sequelize.STRING,
        // references: {
        //   model: app.models['Cart'],
        //   key: 'token'
        // }
      },
      subscription_token: {
        type: Sequelize.STRING,
        // references: {
        //   model: app.models['Subscription'],
        //   key: 'token'
        // }
      },

      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true
        // references: {
        //   model: app.models['Customer'],
        //   key: 'id'
        // }
      },
      shop_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: app.models['Shop'],
        //   key: 'id'
        // }
      },
      // TODO Enable User or Owner
      // Only present on orders processed at point of sale.
      // The unique numerical identifier for the user logged into the terminal at the time the order was processed at.
      user_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'User',
        //   key: 'id'
        // }
      },
      // If this order contains an item that requires shipping
      has_shipping: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // If this order contains an item that requires taxes and customer is not exempt
      has_taxes: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // If this order contains an item that requires a subscription
      has_subscription: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      total_items: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Billing Address on Order
      billing_address: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('Order', app, Sequelize, 'billing_address', {
      //   defaultValue: {}
      // }),
      // Shipping Address on Order
      shipping_address: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('Order', app, Sequelize, 'shipping_address', {
      //   defaultValue: {}
      // }),
      // If Buyer Accepts marketing
      buyer_accepts_marketing: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      // The reason why the order was cancelled. If the order was not cancelled, this value is "null."
      cancel_reason: {
        type: Sequelize.ENUM,
        values: values(ORDER_CANCEL)
      },
      // The time the order was cancelled
      cancelled_at: {
        type: Sequelize.DATE
      },
      // The details from the browser that placed the order
      client_details: {
        // helpers.JSONB('Order', app, Sequelize, 'client_details', {
        type: Sequelize.JSONB,
        defaultValue: {
          'host': null,
          'accept_language': null,
          'browser_height': null,
          'browser_ip': '0.0.0.0',
          'browser_width': null,
          'session_hash': null,
          'user_agent': null,
          'latitude': null,
          'longitude': null
        }
      },
      status: {
        type: Sequelize.ENUM,
        values: values(ORDER_STATUS),
        defaultValue: ORDER_STATUS.OPEN
      },
      // The time the order was closed at.
      closed_at: {
        type: Sequelize.DATE
      },
      // The three letter code (ISO 4217) for the currency used for the payment.
      currency: {
        type: Sequelize.STRING,
        defaultValue: app.config.get('cart.default_currency') || 'USD'
      },
      // The customer's email address. Is required when a billing address is present.
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        }
      },
      // Phone number
      phone: {
        type: Sequelize.STRING
      },
      // manual: Delay 3rd party processing
      // immediate: Immediately process 3rd party payment processing
      payment_kind: {
        type: Sequelize.ENUM,
        values: values(PAYMENT_KIND),
        defaultValue: app.config.get('cart.orders.payment_kind') || PAYMENT_KIND.IMMEDIATE
      },
      // pending: The finances are pending.
      // authorized: The finances have been authorized.
      // partially_paid: The finances have been partially paid.
      // paid: The finances have been paid. (This is the default value.)
      // partially_refunded: The finances have been partially refunded.
      // refunded: The finances have been refunded.
      // voided: The finances have been voided.
      financial_status: {
        type: Sequelize.ENUM,
        values: values(ORDER_FINANCIAL),
        defaultValue: ORDER_FINANCIAL.PENDING
      },
      // authorize:
      // sale:
      transaction_kind: {
        type: Sequelize.ENUM,
        values: values(TRANSACTION_KIND),
        defaultValue: app.config.get('cart.orders.transaction_kind') || TRANSACTION_KIND.AUTHORIZE
      },

      // fulfilled: the order has been completely fulfilled
      // none: the order has no fulfillments
      // partial: the order has some fulfillments
      fulfillment_status: {
        type: Sequelize.ENUM,
        values: values(ORDER_FULFILLMENT),
        defaultValue: ORDER_FULFILLMENT.PENDING
      },
      // immediate: immediately send to fulfillment providers
      // manual: wait until manually sent to fulfillment providers
      fulfillment_kind: {
        type: Sequelize.ENUM,
        values: values(ORDER_FULFILLMENT_KIND),
        defaultValue: app.config.get('cart.orders.fulfillment_kind') || ORDER_FULFILLMENT_KIND.MANUAL
      },
      // The site this sale originated from
      landing_site: {
        type: Sequelize.STRING
      },
      // Only present on orders processed at point of sale.
      // The unique numeric identifier for the physical location at which the order was processed.
      location_id: {
        type: Sequelize.STRING
      },
      // The customer's order name as represented by a number.
      name: {
        type: Sequelize.STRING
      },
      // identifier unique to the shop. A number is a shop and order sequential and starts at 1.
      number: {
        type: Sequelize.STRING
      },
      // The text of an optional note that a shop owner can attach to the order.
      note: {
        type: Sequelize.STRING
      },
      // "note_attributes": ["name": "custom name","value": "custom value"]
      // Extra information that is added to the order. Each array entry must contain a hash with "name" and "value" keys as shown above.
      note_attributes: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('Order', app, Sequelize, 'note_attributes', {
      //   defaultValue: {}
      // }),
      // The list of all payment gateways used for the order.
      payment_gateway_names: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Order', app, Sequelize, 'payment_gateway_names', {
      //   defaultValue: []
      // }),
      // The date and time when the order was imported, in ISO 8601 format.
      // This value can be set to dates in the past when importing from other systems.
      // If no value is provided, it will be auto-generated.
      processed_at: {
        type: Sequelize.DATE
      },
      // States the type of payment processing method. Valid values are:
      // checkout, subscription, direct, manual, offsite or express.
      processing_method: {
        type: Sequelize.ENUM,
        values: values(PAYMENT_PROCESSING_METHOD)
      },
      // The website that the customer clicked on to come to the shop.
      referring_site: {
        type: Sequelize.STRING
      },
      // An array of shipping_line objects, each of which details the shipping methods used.
      shipping_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Order', app, Sequelize, 'shipping_lines', {
      //   defaultValue: []
      // }),
      // The line_items that have discounts
      discounted_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Order', app, Sequelize, 'discounted_lines', {
      //   defaultValue: []
      // }),
      // The line_items that have coupons
      coupon_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Order', app, Sequelize, 'coupon_lines', {
      //   defaultValue: []
      // }),
      // The pricing overrides
      pricing_overrides: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Order', app, Sequelize, 'pricing_overrides', {
      //   defaultValue: []
      // }),
      // USER id of the admin who did the override
      pricing_override_id: {
        type: Sequelize.INTEGER
      },
      // The total amount of pricing overrides
      total_overrides: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Where the order originated. May only be set during creation, and is not writable thereafter.
      // Orders created through official Proxy Engine channels have protected values that cannot be assigned
      // by other API clients during order creation. These protected values are: "web", "pos", "iphone",
      // and "android" Orders created via the API may be assigned any other string of your choice.
      // If source_name is unspecified, new orders are assigned the value "api".
      source_name: {
        type: Sequelize.STRING,
        defaultValue: 'api'
      },
      // Price of the order before shipping and taxes
      subtotal_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // An array of tax_line objects, each of which details the total taxes applicable to the order.
      tax_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Order', app, Sequelize, 'tax_lines', {
      //   defaultValue: []
      // }),
      // tax_lines: helpers.ARRAY('Order', app, Sequelize, Sequelize.JSONB, 'tax_lines', {
      //   defaultValue: []
      // }),
      // An array of refund_line objects, each of which details the total refunds applicable to the order.
      refunded_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Order', app, Sequelize, 'refunded_lines', {
      //   defaultValue: []
      // }),
      // refunded_lines: helpers.ARRAY('Order', app, Sequelize, Sequelize.JSONB, 'refunded_lines', {
      //   defaultValue: []
      // }),
      // States whether or not taxes are included in the order subtotal. Valid values are "true" or "false".
      taxes_included: {
        type: Sequelize.BOOLEAN
      },
      // The total amount of the discounts applied to the price of the order.
      total_discounts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount of coupons applied to the price of the order
      total_coupons: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount of shipping applied to the price of the order
      total_shipping: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total still due
      total_due: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount of refunded transactions
      total_refunds: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount of authorized transactions
      total_authorized: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount of captured transactions
      total_captured: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount of voided transactions
      total_voided: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount of voided transactions
      total_cancelled: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount awaiting success
      total_pending: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The sum of all the prices of all the items in the order.
      total_line_items_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The sum of all the prices of all the items in the order, taxes and discounts included (must be positive).
      total_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The sum of all the taxes applied to the order (must be positive).
      total_tax: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The sum of all the weights of the line items in the order, in grams.
      total_weight: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount of Fulfillments fulfilled
      total_fulfilled_fulfillments: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount of Fulfillments partially fulfilled
      total_partial_fulfillments: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount of Fulfillments left to send to fulfillment
      total_sent_fulfillments: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_cancelled_fulfillments: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount of Fulfillments not yet fulfilled
      total_pending_fulfillments: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // IP addresses
      ip: {
        type: Sequelize.STRING
      },
      // IP address that created the order
      create_ip: {
        type: Sequelize.STRING
      },
      // IP address that last updated the order
      update_ip: {
        type: Sequelize.STRING
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
    // The individual items of this order
    models.Order.hasMany(models.OrderItem, {
      as: 'order_items',
      foreignKey: 'order_id'
    })
    // The fulfillments for this order
    models.Order.hasMany(models.Fulfillment, {
      as: 'fulfillments',
      foreignKey: 'order_id'
    })
    // The transactions for this order
    models.Order.hasMany(models.Transaction, {
      as: 'transactions',
      foreignKey: 'order_id'
    })
    // The list of refunds applied to the order.
    models.Order.hasMany(models.Refund, {
      as: 'refunds',
      foreignKey: 'order_id'
    })
    // Applicable discount codes that can be applied to the order. If no codes exist the value will default to blank.
    models.Order.belongsToMany(models.Discount, {
      as: 'discounts',
      through: {
        model: models.ItemDiscount,
        unique: false,
        scope: {
          model: 'order'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })
    // The tags added to this order
    models.Order.belongsToMany(models.Tag, {
      as: 'tags',
      through: {
        model: models.ItemTag,
        unique: false,
        scope: {
          model: 'order'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })
    // The payment source used to pay this order
    models.Order.belongsToMany(models.Source, {
      as: 'sources',
      through: {
        model: models.OrderSource,
        unique: false
      },
      foreignKey: 'order_id',
      constraints: false
    })
    // The events tied to this order
    models.Order.hasMany(models.Event, {
      as: 'events',
      foreignKey: 'object_id',
      scope: {
        object: 'order'
      },
      constraints: false
    })
    models.Order.hasOne(models.Cart, {
      foreignKey: 'order_id'
    })
    // models.Order.belongsTo(models.Cart, {
    //   targetKey: 'token',
    //   foreignKey: 'cart_token'
    // })
    models.Order.belongsTo(models.Customer, {
      foreignKey: 'customer_id'
    })

    // models.Order.hasOne(models.Customer, {
    //   as: 'last_order',
    //   foreignKey: 'last_order_id'
    // })

    models.Order.belongsToMany(models.Event, {
      as: 'event_items',
      through: {
        model: models.EventItem,
        unique: false,
        scope: {
          object: 'order'
        }
      },
      foreignKey: 'object_id',
      constraints: false
    })

    models.Order.hasMany(models.DiscountEvent, {
      as: 'discount_events',
      foreignKey: 'order_id'
    })

    models.Order.hasMany(models.AccountEvent, {
      as: 'account_events',
      foreignKey: 'order_id'
    })

    models.Order.hasOne(models.Metadata, {
      as: 'metadata',
      foreignKey: 'order_id'
    })
  }
}


export interface Order {
  toJSON(): any
  cancel(data): any
  close(): any
  logDiscountUsage(options): any
  notifyCustomer(preNotification, options): any
  addShipping(shipping, options): any
  removeShipping(shipping, options): any
  addTaxes(taxes, options): any
  removeTaxes(taxes, options): any
  saveShippingAddress(address, options): any
  saveBillingAddress(address, options): any
  groupFulfillments(options): any
  groupTransactions(paymentDetails, options): any
  groupSubscriptions(active, options): any
  fulfill(fulfillments, options): any
  resolveFinancialStatus(options): any
  resolveFulfillmentStatus(options): any
  setStatus(): any
  resolveStatus(options): any
  saveStatus(options): any
  saveFinancialStatus(options): any
  saveFulfillmentStatus(options): any
  setFinancialStatus(): any
  setFulfillmentStatus(): any
  sendToFulfillment(options): any
  resolveSubscribeImmediately(options): any
  resolveSendImmediately(options): any
  attemptImmediate(options): any
  saveItemsShippingLines(items, options): any
  saveItemsTaxLines(items, options): any
  buildOrderItem(item, qty, properties): any
  addItem(orderItem, options): any
  updateItem(orderItem, options): any
  removeItem(orderItem, options): any
  reconcileTransactions(options): any
  resolveCustomer(options): any
  resolveOrderItems(options): any
  resolveRefunds(options): any
  resolveTransactions(options): any
  resolveFulfillments(options): any
  calculateShipping(options): any
  calculateTaxes(options): any
  recalculate(options): any
  sendCreatedEmail(options): any
  sendCancelledEmail(options): any
  sendRefundedEmail(options): any
  sendPaidEmail(options): any
  sendPartiallyPaidEmail(options): any
  sendUpdatedEmail(options): any
}

Order.prototype.toJSON = function() {
  // Make JSON
  const resp = this instanceof this.app.models['Order'].instance ? this.get({ plain: true }) : this

  // Transform Tags to array on toJSON
  if (resp.tags) {
    resp.tags = resp.tags.map(tag => {
      if (tag && isString(tag)) {
        return tag
      }
      else if (tag && tag.name && tag.name !== '') {
        return tag.name
      }
    })
  }
  return resp
}
/**
 *
 */
Order.prototype.cancel = function(data = {}) {
  this.cancelled_at = new Date(Date.now())
  this.status = ORDER_STATUS.CANCELLED
  this.closed_at = this.cancelled_at
  this.cancel_reason = data.cancel_reason || ORDER_CANCEL.OTHER
  return this
}
/**
 * closes the order
 */
Order.prototype.close = function() {
  this.status = ORDER_STATUS.CLOSED
  this.closed_at = new Date(Date.now())
  return this
}
/**
 *
 */
Order.prototype.logDiscountUsage = function(options: {[key: string]: any} = {}) {
  return this.app.models['Order'].sequelize.Promise.mapSeries(this.discounted_lines, line => {
    return this.app.models['Discount'].findById(line.id, {
      attributes: ['id', 'times_used', 'usage_limit'],
      transaction: options.transaction || null
    })
      .then(_discount => {
        return _discount.logUsage(
          this.id,
          this.customer_id,
          line.price,
          {transaction: options.transaction || null}
        )
      })
  })
}
/**
 *
 */
Order.prototype.notifyCustomer = function(preNotification, options: {[key: string]: any} = {}) {
  if (this.customer_id) {
    return this.resolveCustomer(
      {
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
Order.prototype.addShipping = function(shipping = [], options: {[key: string]: any} = {}) {
  return this.resolveOrderItems({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      const shippingLines = this.shipping_lines

      if (isArray(shipping)) {
        shipping.forEach(ship => {
          const i = findIndex(shippingLines, (s: {[key: string]: any}) => {
            return s.name === ship.name
          })
          // Make sure shipping price is a number
          ship.price = this.app.services.ProxyCartService.normalizeCurrency(parseInt(ship.price, 10))
          if (i > -1) {
            shippingLines[i] = ship
          }
          else {
            shippingLines.push(ship)
          }
        })
      }
      else if (isObject(shipping)) {
        const i = findIndex(shippingLines, (s: {[key: string]: any}) => {
          return s.name === shipping.name
        })
        // Make sure shipping price is a number
        shipping.price = this.app.services.ProxyCartService.normalizeCurrency(parseInt(shipping.price, 10))

        if (i > -1) {
          shippingLines[i] = shipping
        }
        else {
          shippingLines.push(shipping)
        }
      }
      this.shipping_lines = shippingLines
      return this.save({transaction: options.transaction || null})
    })
    .then(() => {
      return this.recalculate({transaction: options.transaction || null})
    })
}
/**
 *
 */
Order.prototype.removeShipping = function(shipping = [], options: {[key: string]: any} = {}) {
  return this.resolveOrderItems({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      const shippingLines = this.shipping_lines

      if (isArray(shipping)) {
        shipping.forEach(ship => {
          const i = findIndex(shippingLines, (s: {[key: string]: any}) => {
            return s.name === ship.name
          })
          if (i > -1) {
            shippingLines.splice(i, 1)
          }
        })
      }
      else if (isObject(shipping)) {
        const i = findIndex(shippingLines, (s: {[key: string]: any}) => {
          return s.name === shipping.name
        })
        if (i > -1) {
          shippingLines.splice(i, 1)
        }
      }
      this.shipping_lines = shippingLines
      return this.save({transaction: options.transaction || null})
    })
    .then(() => {
      return this.recalculate({transaction: options.transaction || null})
    })
}
/**
 *
 */
Order.prototype.addTaxes = function(taxes = [], options: {[key: string]: any} = {}) {
  return this.resolveOrderItems({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      const taxLines = this.tax_lines

      if (isArray(taxes)) {
        taxes.forEach(tax => {
          const i = findIndex(taxLines, (s: {[key: string]: any}) => {
            return s.name === tax.name
          })
          // Make sure taxes price is a number
          tax.price = this.app.services.ProxyCartService.normalizeCurrency(parseInt(tax.price, 10))
          if (i > -1) {
            taxLines[i] = tax
          }
          else {
            taxLines.push(tax)
          }
        })
      }
      else if (isObject(taxes)) {
        const i = findIndex(taxLines, (s: {[key: string]: any}) => {
          return s.name === taxes.name
        })
        // Make sure taxes price is a number
        taxes.price = this.app.services.ProxyCartService.normalizeCurrency(parseInt(taxes.price, 10))

        if (i > -1) {
          taxLines[i] = taxes
        }
        else {
          taxLines.push(taxes)
        }
      }
      this.tax_lines = taxLines
      return this.save({transaction: options.transaction || null})
    })
    .then(() => {
      return this.recalculate({transaction: options.transaction || null})
    })
}
/**
 *
 * @param taxes
 * @param options
 * @returns {Promise.<T>}
 */
Order.prototype.removeTaxes = function(taxes = [], options: {[key: string]: any} = {}) {
  return this.resolveOrderItems({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      const taxLines = this.tax_lines

      if (isArray(taxes)) {
        taxes.forEach(tax => {
          const i = findIndex(taxLines, (s: {[key: string]: any}) => {
            return s.name === tax.name
          })
          if (i > -1) {
            taxLines.splice(i, 1)
          }
        })
      }
      else if (isObject(taxes)) {
        const i = findIndex(taxLines, (s: {[key: string]: any}) => {
          return s.name === taxes.name
        })
        if (i > -1) {
          taxLines.splice(i, 1)
        }
      }
      this.tax_lines = taxLines
      return this.save({transaction: options.transaction || null})
    })
    .then(() => {
      return this.recalculate({transaction: options.transaction || null})
    })
}
/**
 *
 */
Order.prototype.saveShippingAddress = function(address, options: {[key: string]: any} = {}) {
  this.shipping_address = extend(this.shipping_address, address)
  this.shipping_address = this.app.services.ProxyCartService.validateAddress(this.shipping_address)
  return this.app.services.GeolocationGenericService.locate(this.shipping_address)
    .then(latLng => {
      this.shipping_address = defaults(this.shipping_address, latLng)
      return this.recalculate({transaction: options.transaction || null})
    })
    .catch(err => {
      return
    })
}

Order.prototype.saveBillingAddress = function(address, options: {[key: string]: any} = {}) {
  this.billing_address = extend(this.billing_address, address)
  this.billing_address = this.app.services.ProxyCartService.validateAddress(this.billing_address)
  return this.app.services.GeolocationGenericService.locate(this.billing_address)
    .then(latLng => {
      this.billing_address = defaults(this.billing_address, latLng)
      return this.recalculate({transaction: options.transaction || null})
    })
    .catch(err => {
      return
    })
}
/**
 *
 */
Order.prototype.groupFulfillments = function(options: {[key: string]: any} = {}) {
  return this.resolveOrderItems({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      return this.resolveFulfillments({
        transaction: options.transaction || null,
        reload: options.reload || null
      })
    })
    .then(() => {

      // Group by Service
      const groups = groupBy(this.order_items, 'fulfillment_service')
      // Map into array
      const tGroups = map(groups, (items, service) => {
        return { service: service, items: items }
      })
      // Create the non sent fulfillments
      return this.app.models['Order'].sequelize.Promise.mapSeries(tGroups, (group) => {
        const resFulfillment = this.fulfillments.find(fulfillment => fulfillment.service === group.service)
        return resFulfillment.addOrder_items(group.items, {
          hooks: false,
          individualHooks: false,
          returning: false,
          transaction: options.transaction || null
        })
          .then(() => {
            return resFulfillment.reload({ transaction: options.transaction || null })
          })
        // .then(() => {
        //   return resFulfillment.saveFulfillmentStatus()
        // })
      })
    })
    .then((fulfillments) => {
      fulfillments = fulfillments || []
      this.fulfillments = fulfillments
      this.setDataValue('fulfillments', fulfillments)
      this.set('fulfillments', fulfillments)
      return this
    })
}
/**
 *
 * @param paymentDetails
 * @param options
 * @returns {*|Promise.<T>}
 */
Order.prototype.groupTransactions = function(paymentDetails, options: {[key: string]: any} = {}) {
  return this.app.models['Order'].sequelize.Promise.mapSeries(paymentDetails, (detail, index) => {
    const transaction = this.app.models['Transaction'].build({
      // Set the customer id (in case we can save this source)
      customer_id: this.customer_id,
      // Set the order id
      order_id: this.id,
      // Set the source if it is given
      source_id: detail.source ? detail.source.id : null,
      // Set the account if it is given
      account_id: detail.source ? detail.source.account_id : null,
      // Set the order currency
      currency: this.currency,
      // Set the amount for this transaction and handle if it is a split transaction
      amount: detail.amount || this.total_due,
      // Copy the entire payment details to this transaction
      payment_details: paymentDetails[index],
      // Specify the gateway to use
      gateway: detail.gateway,
      // Set the specific type of transactions this is
      kind: this.transaction_kind,
      // Set the device (that input the credit card) or null
      device_id: this.device_id || null,
      // Set the Description
      description: `Order ${this.name} original transaction ${this.transaction_kind}`
    })
    // Return the Payment Service
    if (this.payment_kind === PAYMENT_KIND.MANUAL) {
      return this.app.services.PaymentService.manual(transaction, {
        transaction: options.transaction || null
      })
    }
    else {
      return this.app.services.PaymentService[this.transaction_kind](transaction, {
        transaction: options.transaction || null
      })
    }
  })
    .then(transactions => {
      transactions = transactions || []
      this.transactions = transactions
      this.setDataValue('transactions', transactions)
      this.set('transactions', transactions)
      return this
    })
}

Order.prototype.groupSubscriptions = function(active, options: {[key: string]: any} = {}) {
  return this.resolveOrderItems({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {

      const orderItems = filter(this.order_items, 'requires_subscription')

      const groups = []
      const units = groupBy(orderItems, 'subscription_unit')

      forEach(units, function(value, unit) {
        const intervals = groupBy(units[unit], 'subscription_interval')
        forEach(intervals, (items, interval) => {
          groups.push({
            unit: unit,
            interval: interval,
            items: items
          })
        })
      })

      return this.app.models['Order'].sequelize.Promise.mapSeries(groups, group => {
        return this.app.services.SubscriptionService.create(
          this,
          group.items,
          group.unit,
          group.interval,
          active,
          { transaction: options.transaction || null}
        )
      })
    })
    .then(subscriptions => {
      subscriptions = subscriptions || []
      this.subscriptions = subscriptions
      this.set('subscriptions', subscriptions)
      this.setDataValue('subscriptions', subscriptions)
      return this
    })
}
/**
 *
 */
Order.prototype.fulfill = function(fulfillments = [], options: {[key: string]: any} = {}) {

  let toFulfill = []

  return this.resolveOrderItems({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      return this.resolveFulfillments({
        transaction: options.transaction || null,
        reload: options.reload || null
      })
    })
    .then(() => {
      toFulfill = fulfillments.map(fulfillment => this.fulfillments.find(f => f.id === fulfillment.id))
      // Remove empties
      toFulfill = toFulfill.filter(f => f)
      return this.sequelize.Promise.mapSeries(toFulfill, resFulfillment => {
        if (!(resFulfillment instanceof this.app.models['Fulfillment'].instance)) {
          throw new Error('resFulfillment is not an instance of Fulfillment')
        }
        const fulfillment = fulfillments.find(f => f.id === resFulfillment.id)
        const update = {
          status: fulfillment.status || resFulfillment.status,
          status_url: fulfillment.status_url || resFulfillment.status_url,
          tracking_company: fulfillment.tracking_company || resFulfillment.tracking_company,
          tracking_number: fulfillment.tracking_number || resFulfillment.tracking_number,
          receipt: fulfillment.receipt || resFulfillment.receipt
        }
        return resFulfillment.fulfillUpdate(
          update,
          {
            transaction: options.transaction || null
          })
      })
    })
    .then(() => {
      return this.resolveFulfillments({reload: true, transaction: options.transaction || null})
    })
    .then(() => {
      return this.saveFulfillmentStatus({transaction: options.transaction || null})
    })
}

/**
 *
 */
Order.prototype.resolveFinancialStatus = function(options: {[key: string]: any} = {}) {
  if (!this.id) {
    return Promise.resolve(this)
  }
  return this.resolveTransactions({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      // Set the new financial status
      this.setFinancialStatus()
      return this
    })
}
/**
 *
 */
Order.prototype.resolveFulfillmentStatus = function (options: {[key: string]: any} = {}) {
  if (!this.id) {
    return Promise.resolve(this)
  }
  // Set fulfillment status requires fulfillments be resolved.
  return this.resolveFulfillments({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      // Set fulfillment status requires that order items also be resolved
      return this.resolveOrderItems({
        transaction: options.transaction || null,
        reload: options.reload || null
      })
    })
    .then(() => {
      // Set the new fulfillment status
      this.setFulfillmentStatus()
      return this
    })
}
/**
 *
 */
Order.prototype.setStatus = function () {
  if (
    this.financial_status === ORDER_FINANCIAL.PAID
    && this.fulfillment_status === ORDER_FULFILLMENT.FULFILLED
    && this.status === ORDER_STATUS.OPEN
  ) {
    this.close()
  }
  else if (
    this.financial_status === ORDER_FINANCIAL.CANCELLED
    && this.fulfillment_status === ORDER_FULFILLMENT.CANCELLED
    && this.status === ORDER_STATUS.OPEN
  ) {
    this.cancel()
  }
  return this
}
/**
 *
 */
Order.prototype.resolveStatus = function(options: {[key: string]: any} = {}) {
  return this.resolveFinancialStatus({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      return this.resolveFulfillmentStatus({
        transaction: options.transaction || null,
        reload: options.reload || null
      })
    })
    .then(() => {
      return this.setStatus()
    })
}
/**
 *
 * @param options
 * @returns {*}
 */
Order.prototype.saveStatus = function (options: {[key: string]: any} = {}) {
  if (!this.id) {
    return Promise.resolve(this)
  }
  return this.resolveStatus({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      return this.save({
        fields: [
          'status',
          'closed_at',
          'cancelled_at',
          'total_fulfilled_fulfillments',
          'total_sent_fulfillments',
          'total_cancelled_fulfillments',
          'total_partial_fulillments',
          'total_pending_fulfillments',
          'fulfillment_status',
          'financial_status',
          'total_authorized',
          'total_captured',
          'total_refunds',
          'total_voided',
          'total_cancelled',
          'total_pending',
          'total_due'
        ],
        transaction: options.transaction || null
      })
    })
}
/**
 *
 */
Order.prototype.saveFinancialStatus = function(options: {[key: string]: any} = {}) {
  let currentStatus, previousStatus
  // If not a persisted instance
  if (!this.id) {
    return Promise.resolve(this)
  }
  return this.resolveFinancialStatus({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      if (this.changed('financial_status')) {
        currentStatus = this.financial_status
        previousStatus = this.previous('financial_status')
      }
      return this.save({
        fields: [
          'financial_status',
          'total_authorized',
          'total_captured',
          'total_refunds',
          'total_voided',
          'total_cancelled',
          'total_pending',
          'total_due'
        ],
        transaction: options.transaction || null
      })
    })
    .then(() => {
      if (currentStatus && previousStatus) {
        const event = {
          object_id: this.id,
          object: 'order',
          objects: [{
            customer: this.customer_id
          }, {
            order: this.id
          }],
          type: `order.financial_status.${currentStatus}`,
          message: `Order ${ this.name || 'ID ' + this.id } financial status changed from "${previousStatus}" to "${currentStatus}"`,
          data: this
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      }
      else {
        return
      }
    })
    .then(() => {
      if (currentStatus === ORDER_FINANCIAL.PAID && previousStatus !== ORDER_FINANCIAL.PAID) {
        return this.attemptImmediate(options)
      }
      else {
        return this
      }
    })
    .then(() => {
      return this
    })
}
/**
 *
 */
Order.prototype.saveFulfillmentStatus = function(options: {[key: string]: any} = {}) {
  let currentStatus, previousStatus
  // If not a persisted instance return right away
  if (!this.id) {
    return Promise.resolve(this)
  }
  return this.resolveOrderItems({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      return this.resolveFulfillments({
        transaction: options.transaction || null,
        reload: options.reload || null
      })
    })
    .then(() => {
      this.setFulfillmentStatus()

      if (this.changed('fulfillment_status')) {
        currentStatus = this.fulfillment_status
        previousStatus = this.previous('fulfillment_status')
      }
      return this.save({
        fields: [
          'total_fulfilled_fulfillments',
          'total_sent_fulfillments',
          'total_cancelled_fulfillments',
          'total_partial_fulillments',
          'total_pending_fulfillments',
          'fulfillment_status'
        ],
        transaction: options.transaction || null
      })
    })
    .then(() => {
      if (currentStatus && previousStatus) {
        const event = {
          object_id: this.id,
          object: 'order',
          objects: [{
            customer: this.customer_id
          }, {
            order: this.id
          }],
          type: `order.fulfillment_status.${currentStatus}`,
          message: `Order ${ this.name || 'ID ' + this.id } fulfillment status changed from "${previousStatus}" to "${currentStatus}"`,
          data: this
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      }
      else {
        return
      }
    })
    .then(() => {
      return this
    })
}
/**
 *
 */
Order.prototype.setFinancialStatus = function() {
  if (!this.transactions) {
    throw new Error('Order.setFinancialStatus requires transactions to be populated')
    // return Promise.reject(err)
  }

  const pending = this.transactions.filter(transaction => [
    TRANSACTION_STATUS.PENDING,
    TRANSACTION_STATUS.FAILURE,
    TRANSACTION_STATUS.ERROR
  ].indexOf(transaction.status ) > -1)

  const cancelled = this.transactions.filter(transaction => [
    TRANSACTION_STATUS.CANCELLED
  ].indexOf(transaction.status ) > -1)

  const successes = this.transactions.filter(transaction => [
    TRANSACTION_STATUS.SUCCESS
  ].indexOf(transaction.status ) > -1)

  let financialStatus = ORDER_FINANCIAL.PENDING

  let totalAuthorized = 0
  let totalVoided  = 0
  let totalSale = 0
  let totalRefund = 0
  let totalCancelled = 0
  let totalPending = 0

  // Calculate the totals of the successful transactions
  each(successes, transaction => {
    if (transaction.kind === TRANSACTION_KIND.AUTHORIZE) {
      totalAuthorized = totalAuthorized + transaction.amount
    }
    else if (transaction.kind === TRANSACTION_KIND.VOID) {
      totalVoided = totalVoided + transaction.amount
    }
    else if (transaction.kind === TRANSACTION_KIND.CAPTURE) {
      totalSale = totalSale + transaction.amount
    }
    else if (transaction.kind === TRANSACTION_KIND.SALE) {
      totalSale = totalSale + transaction.amount
    }
    else if (transaction.kind === TRANSACTION_KIND.REFUND) {
      totalRefund = totalRefund + transaction.amount
    }
  })

  // Calculate the totals of pending transactions
  each(pending, transaction => {
    if (transaction.kind === TRANSACTION_KIND.AUTHORIZE) {
      totalPending = totalPending + transaction.amount
    }
    else if (transaction.kind === TRANSACTION_KIND.CAPTURE) {
      totalPending = totalPending + transaction.amount
    }
    else if (transaction.kind === TRANSACTION_KIND.SALE) {
      totalPending = totalPending + transaction.amount
    }
    else if (transaction.kind === TRANSACTION_KIND.VOID) {
      totalPending = totalPending - transaction.amount
    }
    else if (transaction.kind === TRANSACTION_KIND.REFUND) {
      totalPending = totalPending - transaction.amount
    }
  })

  // Calculate the totals of cancelled pending transactions
  each(cancelled, transaction => {
    if (transaction.kind === TRANSACTION_KIND.AUTHORIZE) {
      totalCancelled = totalCancelled + transaction.amount
    }
    else if (transaction.kind === TRANSACTION_KIND.CAPTURE) {
      totalCancelled = totalCancelled + transaction.amount
    }
    else if (transaction.kind === TRANSACTION_KIND.SALE) {
      totalCancelled = totalCancelled + transaction.amount
    }
    else if (transaction.kind === TRANSACTION_KIND.VOID) {
      totalCancelled = totalCancelled - transaction.amount
    }
    else if (transaction.kind === TRANSACTION_KIND.REFUND) {
      totalCancelled = totalCancelled - transaction.amount
    }
  })

  // If this a draft style order with 0 items in it
  if (this.total_items === 0) {
    financialStatus = ORDER_FINANCIAL.PENDING
  }
  // If this item is completely free
  else if (this.total_price === 0 && this.total_items > 0) {
    financialStatus = ORDER_FINANCIAL.PAID
  }
  // Total Authorized is the Price of the Order and there are no Capture/Sale transactions and 0 voided
  else if (
    totalAuthorized === this.total_price
    && totalSale === 0
    && totalVoided === 0
    && totalRefund === 0
    && this.total_items > 0
  ) {
    financialStatus = ORDER_FINANCIAL.AUTHORIZED
  }
  // Total Authorized is the Price of the Order and there are no Capture/Sale transactions
  else if (
    totalAuthorized === totalVoided
    && totalVoided > 0
    && this.total_items > 0
  ) {
    financialStatus = ORDER_FINANCIAL.VOIDED
  }
  else if (
    this.total_price === totalVoided
    && totalVoided > 0
    && this.total_items > 0
  ) {
    financialStatus = ORDER_FINANCIAL.VOIDED
  }
  // Total Sale is the Price of the order and there are no refunds
  else if (
    totalSale === this.total_price
    && totalRefund === 0
    && this.total_items > 0
  ) {
    financialStatus = ORDER_FINANCIAL.PAID
  }
  // Total Sale is not yet the Price of the order and there are no refunds
  else if (
    totalSale < this.total_price
    && totalSale > 0
    && totalRefund === 0
    && this.total_items > 0
  ) {
    financialStatus = ORDER_FINANCIAL.PARTIALLY_PAID
  }
  // Total Sale is the Total Price and Total Refund is Total Price
  else if (
    this.total_price ===  totalRefund
    && this.total_items > 0
  ) {
    financialStatus = ORDER_FINANCIAL.REFUNDED
  }
  // Total Sale is the Total Price but Total Refund is less than the Total Price
  else if (
    totalRefund < this.total_price
    && totalRefund > 0
    && this.total_items > 0
  ) {
    financialStatus = ORDER_FINANCIAL.PARTIALLY_REFUNDED
  }
  else if (
    this.total_price === totalCancelled
    && this.total_items > 0
  ) {
    financialStatus = ORDER_FINANCIAL.CANCELLED
  }
  // tslint:disable:max-line-length
  this.app.log.debug(`ORDER ${this.id}: FINANCIAL Status: ${financialStatus}, Sales: ${totalSale}, Authorized: ${totalAuthorized}, Refunded: ${totalRefund}, Pending: ${totalPending}, Cancelled: ${totalCancelled}`)
  // pending: The finances are pending. (This is the default value.)
  // cancelled: The finances pending have been cancelled.
  // authorized: The finances have been authorized.
  // partially_paid: The finances have been partially paid.
  // paid: The finances have been paid.
  // partially_refunded: The finances have been partially refunded.
  // refunded: The finances have been refunded.
  // voided: The finances have been voided.
  this.financial_status = financialStatus
  this.total_authorized = totalAuthorized
  this.total_captured = totalSale
  this.total_refunds = totalRefund
  this.total_voided = totalVoided
  this.total_cancelled = totalCancelled
  this.total_pending = totalPending
  this.total_due = this.total_price - totalSale
  return this
}
/**
 *
 */
Order.prototype.setFulfillmentStatus = function() {
  if (!this.fulfillments) {
    throw new Error('Order.setFulfillmentStatus requires fulfillments to be populated')
    // return Promise.reject(err)
  }
  if (!this.order_items) {
    throw new Error('Order.setFulfillmentStatus requires order_items to be populated')
    // return Promise.reject(err)
  }

  let fulfillmentStatus = ORDER_FULFILLMENT.PENDING
  let totalFulfillments = 0
  let totalPartialFulfillments = 0
  let totalSentFulfillments = 0
  let totalNonFulfillments = 0
  let totalPendingFulfillments = 0
  let totalCancelledFulfillments = 0

  this.fulfillments.forEach(fulfillment => {
    if (fulfillment.status === FULFILLMENT_STATUS.FULFILLED) {
      totalFulfillments++
    }
    else if (fulfillment.status === FULFILLMENT_STATUS.PARTIAL) {
      totalPartialFulfillments++
    }
    else if (fulfillment.status === FULFILLMENT_STATUS.SENT) {
      totalSentFulfillments++
    }
    else if (fulfillment.status === FULFILLMENT_STATUS.NONE) {
      totalNonFulfillments++
    }
    else if (fulfillment.status === FULFILLMENT_STATUS.PENDING) {
      totalPendingFulfillments++
    }
    else if (fulfillment.status === FULFILLMENT_STATUS.CANCELLED) {
      totalCancelledFulfillments++
    }
  })

  if (totalFulfillments === this.fulfillments.length && this.fulfillments.length > 0) {
    fulfillmentStatus = ORDER_FULFILLMENT.FULFILLED
  }
  else if (totalSentFulfillments === this.fulfillments.length && this.fulfillments.length > 0) {
    fulfillmentStatus = ORDER_FULFILLMENT.SENT
  }
  else if (totalPartialFulfillments > 0) {
    fulfillmentStatus = ORDER_FULFILLMENT.PARTIAL
  }
  else if (totalNonFulfillments >= this.fulfillments.length && this.fulfillments.length > 0) {
    fulfillmentStatus = ORDER_FULFILLMENT.NONE // back to default
  }
  else if (totalCancelledFulfillments === this.fulfillments.length && this.fulfillments.length > 0) {
    fulfillmentStatus = ORDER_FULFILLMENT.CANCELLED // back to default
  }
  else if (totalPendingFulfillments === this.fulfillments.length && this.fulfillments.length > 0) {
    fulfillmentStatus = ORDER_FULFILLMENT.PENDING // back to default
  }
  // IF done or cancelled
  if (fulfillmentStatus === ORDER_FULFILLMENT.FULFILLED || fulfillmentStatus === ORDER_FULFILLMENT.CANCELLED) {
    this.status = ORDER_STATUS.CLOSED
  }

  this.total_fulfilled_fulfillments = totalFulfillments
  this.total_partial_fulfillments = totalPartialFulfillments
  this.total_sent_fulfillments  = totalSentFulfillments
  this.total_cancelled_fulfillments  = totalCancelledFulfillments
  this.total_pending_fulfillments = totalPendingFulfillments
  this.fulfillment_status = fulfillmentStatus
  return this
}

/**
 *
 */
Order.prototype.sendToFulfillment = function(options: {[key: string]: any} = {}) {

  return this.resolveFulfillments({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      return this.app.models['Order'].sequelize.Promise.mapSeries(this.fulfillments, fulfillment => {
        return this.app.services.FulfillmentService.sendFulfillment(this, fulfillment, {transaction: options.transaction || null})
      })
    })
    .then(fulfillments => {
      fulfillments = fulfillments || []
      this.fulfillments = fulfillments
      this.setDataValue('fulfillments', fulfillments)
      this.set('fulfillments', fulfillments)

      return this
    })
}
/**
 * Resolve if this should subscribe immediately
 */
Order.prototype.resolveSubscribeImmediately = function(options: {[key: string]: any} = {}) {
  if (!this.has_subscription) {
    return Promise.resolve(false)
  }
  return this.resolveFinancialStatus({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      return this.financial_status === ORDER_FINANCIAL.PAID
    })
}
/**
 * Resolve if this should send to fulfillment immediately
 */
Order.prototype.resolveSendImmediately = function(options: {[key: string]: any} = {}) {

  if (this.fulfillment_kind !== ORDER_FULFILLMENT_KIND.IMMEDIATE) {
    return Promise.resolve(false)
  }
  if ([ORDER_FULFILLMENT.PENDING, ORDER_FULFILLMENT.NONE].indexOf(this.fulfillment_status) === -1) {
    return Promise.resolve(false)
  }
  return this.resolveFinancialStatus({ transaction: options.transaction || null })
    .then(() => {
      return this.financial_status === ORDER_FINANCIAL.PAID
    })
}
/**
 *
 */
Order.prototype.attemptImmediate = function(options: {[key: string]: any} = {}) {
  return this.resolveSendImmediately({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(immediate => {
      if (immediate) {
        return this.sendToFulfillment({ transaction: options.transaction || null })
      }
      else {
        return this.fulfillments
      }
    })
    .then(() => {
      // Determine if this subscription should be created immediately
      return this.resolveSubscribeImmediately({
        transaction: options.transaction || null,
        reload: options.reload || null
      })
    })
    .then(immediate => {
      if (immediate) {
        return this.groupSubscriptions(
          immediate,
          { transaction: options.transaction || null }
        )
      }
      else {
        return
      }
    })
    .then((subscriptions) => {
      return this
    })
}
/**
 *
 */
Order.prototype.saveItemsShippingLines = function (items, options: {[key: string]: any} = {}) {
  // Filter any non manual shipping lines
  let shippingLines = this.shipping_lines.filter(line =>
    Object.keys(line).indexOf('id') === -1
    && Object.keys(line).indexOf('line') === -1
  )

  return this.app.models['OrderItem'].sequelize.Promise.mapSeries(items, item => {
    return item.setItemsShippingLines(items.find(i => i.id === item.id))
      .save(options)
  })
    .then(_items => {
      _items.forEach(item => {
        shippingLines = [...shippingLines, ...item.shipping_lines]
      })

      // Add in shipping_lines from items
      this.shipping_lines = shippingLines

      return this
    })
}
/**
 *
 */
Order.prototype.saveItemsTaxLines = function (items = [], options: {[key: string]: any} = {}) {
  // Filter any non manual tax lines
  let taxLines = this.tax_lines.filter(line =>
    Object.keys(line).indexOf('id') === -1
    && Object.keys(line).indexOf('line') === -1
  )

  return this.app.models['OrderItem'].sequelize.Promise.mapSeries(items, item => {
    return item.setItemsTaxLines(items.find(i => i.id === item.id))
      .save(options)
  })
    .then(_items => {
      _items.forEach(item => {
        taxLines = [...taxLines, ...item.tax_lines]
      })

      // Add in tax_lines from items
      this.tax_lines = taxLines

      return this
    })
}

/**
 *
 * @param lines
 */
// setTaxLines: function(lines) {
//   this.total_tax = 0
//   this.tax_lines = lines || []
//   this.tax_lines.forEach(line => {
//     this.total_tax = this.total_tax + line.price
//   })
//   return this.setTotals()
// },

/**
 * Builds obj for Order Item
 */
// TODO resolve vendor, check fulfillable quantity, calculate price
Order.prototype.buildOrderItem = function(item, qty = 0, properties) {
  item.Product = item.Product || {}
  item.images = item.images || []
  const OrderItem = this.app.models['OrderItem']

  return OrderItem.build({
    order_id: this.id,
    customer_id: this.customer_id,
    product_id: item.product_id,
    title: item.Product.title,
    product_handle: item.Product.handle,
    variant_id: item.id,
    variant_title: item.title,
    sku: item.sku,
    type: item.type,
    name: item.title === item.Product.title ? item.title : `${item.Product.title} - ${item.title}`,
    quantity: qty,
    properties: properties,
    option: item.option,
    barcode: item.barcode,
    price: item.price * qty,
    calculated_price: item.price * qty,
    compare_at_price: (item.compare_at_price || item.price) * qty,
    price_per_unit: item.price,
    currency: item.currency,
    fulfillment_service: item.fulfillment_service,
    gift_card: item.gift_card,
    requires_shipping: item.requires_shipping,
    requires_taxes: item.requires_taxes,
    tax_code: item.tax_code,
    tax_lines: item.tax_lines || [],
    total_taxes: item.total_taxes,
    shipping_lines: item.shipping_lines || [],
    total_shipping: item.total_shipping,
    discounted_lines: item.discounted_lines || [],
    total_discounts: 0,
    coupon_lines: item.coupon_lines || [],
    requires_subscription: item.requires_subscription,
    subscription_interval: item.subscription_interval,
    subscription_unit: item.subscription_unit,
    weight: item.weight * qty,
    weight_unit: item.weight_unit,
    images: item.images.length > 0 ? item.images : item.Product.images || [],
    fulfillable_quantity: item.fulfillable_quantity || qty,
    max_quantity: item.max_quantity,
    grams: this.app.services.ProxyCartService.resolveConversion(item.weight, item.weight_unit) * qty,
    average_shipping: item.Product.average_shipping,
    exclude_payment_types: item.Product.exclude_payment_types,
    vendor_id: item.Product.vendors ? item.Product.vendors[0].id : null,
    live_mode: item.live_mode
  })
}
/**
 *
 */
// TODO shipping_lines coupon_lines discount_lines to parent order
Order.prototype.addItem = function(orderItem, options: {[key: string]: any} = {}) {
  if (!this.order_items) {
    const err = new Error('Order.addItem requires order_items to be populated')
    return Promise.reject(err)
  }
  return Promise.resolve()
    .then(() => {
      const prevOrderItem = this.order_items.find(item =>
        item.product_id === orderItem.product_id && item.variant_id === orderItem.variant_id)

      if (!prevOrderItem) {
        return orderItem.reconcileFulfillment({ transaction: options.transaction || null })
          .then(() => {
            return orderItem.save({ transaction: options.transaction || null })
          })
      }
      else {
        // prevOrderItem.quantity = prevOrderItem.quantity + orderItem.quantity
        // prevOrderItem.fufillable_quantity = prevOrderItem.fufillable_quantity + orderItem.fulfillable_quantity
        // prevOrderItem.price = prevOrderItem.price + orderItem.price
        // prevOrderItem.calculated_price = prevOrderItem.calculated_price + prevOrderItem.calculated_price
        // prevOrderItem.weight = prevOrderItem.weight + prevOrderItem.weight
        // prevOrderItem.total_weight = prevOrderItem.total_weight + prevOrderItem.total_weight

        prevOrderItem.quantity = prevOrderItem.quantity + orderItem.quantity
        prevOrderItem.fufillable_quantity = prevOrderItem.fufillable_quantity + orderItem.fulfillable_quantity
        prevOrderItem.price = prevOrderItem.price + orderItem.price
        prevOrderItem.calculated_price = prevOrderItem.calculated_price + prevOrderItem.calculated_price
        prevOrderItem.compare_at_price = prevOrderItem.compare_at_price + orderItem.compare_at_price
        prevOrderItem.weight = prevOrderItem.weight + prevOrderItem.weight
        prevOrderItem.total_weight = prevOrderItem.total_weight + prevOrderItem.total_weight

        if (orderItem.properties) {
          prevOrderItem.properties = orderItem.properties
        }
        return prevOrderItem.reconcileFulfillment({ transaction: options.transaction || null })
          .then(() => {
            return prevOrderItem.save({transaction: options.transaction || null})
          })
      }
    })
    .then((item) => {
      return this.resolveOrderItems({reload: true, transaction: options.transaction || null})
    })
    .then(() => {
      return this.resolveFulfillments({reload: true, transaction: options.transaction || null})
    })
    .then(() => {
      return this.resolveTransactions({reload: true, transaction: options.transaction || null})
    })
}
/**
 *
 */
// TODO add shipping_lines coupon_lines discount_lines to parent order
Order.prototype.updateItem = function(orderItem, options: {[key: string]: any} = {}) {
  if (!this.order_items) {
    const err = new Error('Order.updateItem requires order_items to be populated')
    return Promise.reject(err)
  }

  return Promise.resolve()
    .then(() => {
      const prevOrderItem = this.order_items.find(item =>
        item.product_id === orderItem.product_id && item.variant_id === orderItem.variant_id)

      if (!prevOrderItem) {
        return
      }

      if (options.add) {
        prevOrderItem.quantity = prevOrderItem.quantity + orderItem.quantity
        prevOrderItem.fulfillable_quantity = prevOrderItem.fulfillable_quantity + orderItem.fulfillable_quantity
        prevOrderItem.price = prevOrderItem.price + orderItem.price
        prevOrderItem.calculated_price = prevOrderItem.calculated_price + orderItem.calculated_price
        prevOrderItem.compare_at_price = prevOrderItem.compare_at_price + orderItem.compare_at_price
        prevOrderItem.weight = prevOrderItem.weight + orderItem.weight
        prevOrderItem.total_weight = prevOrderItem.total_weight + orderItem.total_weight
      }
      else if (options.remove) {
        prevOrderItem.quantity = prevOrderItem.quantity - orderItem.quantity
        prevOrderItem.fulfillable_quantity = prevOrderItem.fulfillable_quantity - orderItem.fulfillable_quantity
        prevOrderItem.price = prevOrderItem.price - orderItem.price
        prevOrderItem.calculated_price = prevOrderItem.calculated_price - orderItem.calculated_price
        prevOrderItem.compare_at_price = prevOrderItem.compare_at_price - orderItem.compare_at_price
        prevOrderItem.weight = prevOrderItem.weight - orderItem.weight
        prevOrderItem.total_weight = prevOrderItem.total_weight - orderItem.total_weight
      }
      else {
        // prevOrderItem.quantity = prevOrderItem.quantity + orderItem.quantity
        // prevOrderItem.fulfillable_quantity = prevOrderItem.fulfillable_quantity + orderItem.fulfillable_quantity
        // prevOrderItem.price = prevOrderItem.price + orderItem.price
        // prevOrderItem.calculated_price = prevOrderItem.calculated_price + orderItem.calculated_price
        // prevOrderItem.compare_at_price = prevOrderItem.compare_at_price + orderItem.compare_at_price
        // prevOrderItem.weight = prevOrderItem.weight + orderItem.weight
        // prevOrderItem.total_weight = prevOrderItem.total_weight + orderItem.total_weight

        prevOrderItem.quantity = orderItem.quantity
        prevOrderItem.fulfillable_quantity = orderItem.fulfillable_quantity
        prevOrderItem.price = orderItem.price
        prevOrderItem.calculated_price = orderItem.calculated_price
        prevOrderItem.compare_at_price = orderItem.compare_at_price
        prevOrderItem.weight = orderItem.weight
        prevOrderItem.total_weight = orderItem.total_weight
      }

      if (orderItem.properties) {
        prevOrderItem.properties = orderItem.properties
      }

      if (prevOrderItem.quantity <= 0) {
        return prevOrderItem.reconcileFulfillment({ transaction: options.transaction || null })
          .then(() => {
            return prevOrderItem.destroy({transaction: options.transaction || null})
          })
      }
      else {
        return prevOrderItem.reconcileFulfillment({ transaction: options.transaction || null })
          .then(() => {
            return prevOrderItem.save({transaction: options.transaction || null})
          })
      }
    })
    .then(() => {
      return this.resolveOrderItems({reload: true, transaction: options.transaction || null})
    })
    .then(() => {
      return this.resolveFulfillments({reload: true, transaction: options.transaction || null})
    })
    .then(() => {
      return this.resolveTransactions({reload: true, transaction: options.transaction || null})
    })
}
/**
 *
 */
// TODO remove tax_lines shipping_lines coupon_lines discount_lines to parent order
Order.prototype.removeItem = function(orderItem, options: {[key: string]: any} = {}) {
  if (!this.order_items) {
    const err = new Error('Order.removeItem requires order_items to be populated')
    return Promise.reject(err)
  }

  return Promise.resolve()
    .then(() => {
      const prevOrderItem = this.order_items.find(item =>
        item.product_id === orderItem.product_id
        && item.variant_id === orderItem.variant_id
      )

      if (!prevOrderItem) {
        return
      }

      prevOrderItem.quantity = prevOrderItem.quantity - orderItem.quantity
      prevOrderItem.price = prevOrderItem.price - orderItem.price
      prevOrderItem.calculated_price = prevOrderItem.calculated_price - orderItem.calculated_price
      prevOrderItem.weight = prevOrderItem.weight - orderItem.weight
      prevOrderItem.total_weight = prevOrderItem.total_weight - orderItem.total_weight

      if (prevOrderItem.quantity <= 0) {
        return prevOrderItem.reconcileFulfillment({ transaction: options.transaction || null })
          .then(() => {
            return prevOrderItem.destroy({transaction: options.transaction || null})
          })
      }
      else {
        return prevOrderItem.reconcileFulfillment({ transaction: options.transaction || null })
          .then(() => {
            return prevOrderItem.save({transaction: options.transaction || null})
          })
      }
    })
    .then(() => {
      return this.resolveOrderItems({reload: true, transaction: options.transaction || null})
    })
    .then(() => {
      return this.resolveFulfillments({reload: true, transaction: options.transaction || null})
    })
    .then(() => {
      return this.resolveTransactions({reload: true, transaction: options.transaction || null})
    })
}
/**
 *
 */
Order.prototype.reconcileTransactions = function(options: {[key: string]: any} = {}) {
  // Get fresh financial status
  this.setFinancialStatus()
  // Test if the total due has changed
  if (this.changed('total_due')) {
    // partially cancel/void/refund
    if (this.total_due <= this.previous('total_due')) {
      const amount = this.previous('total_due') - this.total_due
      return this.app.services.TransactionService.reconcileUpdate(
        this,
        amount,
        { transaction: options.transaction || null }
      )
    }
    // authorize/capture/sale
    else {
      const amount = this.total_due - this.previous('total_due')
      // this.app.log.debug('CREATE NEW TRANSACTION', amount)
      return this.app.services.TransactionService.reconcileCreate(
        this,
        amount,
        { transaction: options.transaction || null }
      )
    }
  }
  else {
    return Promise.resolve(this)
  }
}
/**
 * Resolve Order's Customer if there is one
 */
Order.prototype.resolveCustomer = function(options: {[key: string]: any} = {}) {
  if (
    this.Customer
    && this.Customer instanceof this.app.models['Customer'].instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  // Some orders may not have a customer Id
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
}
/**
 *
 */
Order.prototype.resolveOrderItems = function(options: {[key: string]: any} = {}) {
  if (
    this.order_items
    && this.order_items.every(o => o instanceof this.app.models['OrderItem'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getOrder_items({transaction: options.transaction || null})
      .then((orderItems = []) => {
        this.order_items = orderItems
        this.setDataValue('order_items', orderItems)
        this.set('order_items', orderItems)
        return this
      })
  }
}
/**
 *
 */
Order.prototype.resolveRefunds = function(options: {[key: string]: any} = {}) {
  let totalRefunds = 0
  if (
    this.refunds
    && this.refunds.every(r => r instanceof this.app.models['Refund'].instance)
    && options.reload !== true
  ) {
    this.refunds.forEach(refund => {
      totalRefunds = totalRefunds + refund.amount
    })
    this.total_refunds = totalRefunds
    return Promise.resolve(this)
  }
  else {
    return this.getRefunds({transaction: options.transaction || null})
      .then((refunds = []) => {
        this.refunds = refunds
        this.setDataValue('refunds', refunds)
        this.set('refunds', refunds)

        this.refunds.forEach(refund => {
          totalRefunds = totalRefunds + refund.amount
        })
        this.total_refunds = totalRefunds

        return this
      })
  }
}
/**
 *
 */
Order.prototype.resolveTransactions = function(options: {[key: string]: any} = {}) {
  if (
    this.transactions
    && this.transactions.every(t => t instanceof this.app.models['Transaction'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getTransactions({transaction: options.transaction || null})
      .then((transactions = []) => {
        this.transactions = transactions
        this.setDataValue('transactions', transactions)
        this.set('transactions', transactions)
        return this
      })
  }
}
/**
 *
 */
Order.prototype.resolveFulfillments = function(options: {[key: string]: any} = {}) {
  if (
    this.fulfillments
    && this.fulfillments.every(f => f instanceof this.app.models['Fulfillment'].instance)
    && options.reload !== true
  ) {
    return this.sequelize.Promise.mapSeries(this.fulfillments, fulfillment => {
      return fulfillment.resolveOrderItems({
        transaction: options.transaction || null,
        reload: options.reload || null
      })
    })
      .then((fulfillments = []) => {
        this.fulfillments = fulfillments
        this.setDataValue('fulfillments', fulfillments)
        this.set('fulfillments', fulfillments)
        return this
      })
  }
  else {
    return this.getFulfillments({
      include: [{
        model: this.app.models['OrderItem'].instance,
        as: 'order_items'
      }],
      transaction: options.transaction || null
    })
      .then((fulfillments = []) => {
        this.fulfillments = fulfillments
        this.setDataValue('fulfillments', fulfillments)
        this.set('fulfillments', fulfillments)
        return this
      })
  }
}
/**
 *
 */
Order.prototype.calculateShipping = function(options: {[key: string]: any} = {}) {
  if (!this.has_shipping) {
    return Promise.resolve(this)
  }
  return this.resolveOrderItems(options)
    .then(() => {
      return this.app.services.ShippingService.calculate(
        this,
        this.order_items,
        this.shipping_address,
        this.app.models['Order'],
        options
      )
    })
    .then(shippingResult => {
      return this.saveItemsShippingLines(shippingResult.line_items, options)
    })
    .catch(err => {
      this.app.log.error(err)
      return this
    })
}
/**
 *
 */
Order.prototype.calculateTaxes = function(options: {[key: string]: any} = {}) {
  if (!this.has_taxes) {
    return Promise.resolve(this)
  }
  return this.resolveOrderItems(options)
    .then(() => {
      return this.app.services.TaxService.calculate(
        this,
        this.order_items,
        this.shipping_address,
        this.app.models['Order'],
        options
      )
    })
    .then(taxesResult => {
      return this.saveItemsTaxLines(taxesResult.line_items, options)
    })
    .catch(err => {
      this.app.log.error(err)
      return this
    })
}
/**
 *
 */
Order.prototype.recalculate = function(options: {[key: string]: any} = {}) {

  let totalLineItemsPrice = 0
  let totalShipping = 0
  let totalTax = 0
  let totalDiscounts = 0
  let totalCoupons = 0
  let totalOverrides = 0
  let totalItems = 0

  return this.resolveOrderItems({ transaction: options.transaction || null })
    .then(() => {
      this.order_items.forEach(item => {
        totalLineItemsPrice = totalLineItemsPrice + item.price
        totalItems = totalItems + item.quantity
      })

      this.has_shipping = this.order_items.some(item => item.requires_shipping)
      this.has_taxes = this.order_items.some(item => item.requires_taxes)

      // Set the Total Items
      this.total_items = totalItems

      // Set the Total Line Items Price
      this.total_line_items_price = totalLineItemsPrice

      this.pricing_overrides.forEach(i => {
        totalOverrides = totalOverrides + i.price
      })
      this.discounted_lines.forEach(i => {
        totalDiscounts = totalDiscounts + i.price
      })
      this.coupon_lines.forEach(i => {
        totalCoupons = totalCoupons + i.price
      })

      this.total_discounts = totalDiscounts
      this.total_coupons = totalCoupons
      this.total_overrides = totalOverrides

      this.subtotal_price = Math.max(0, this.total_line_items_price)

      return this.calculateTaxes({transactions: options.transaction || null})
    })
    .then(() => {
      this.tax_lines.forEach(i => {
        totalTax = totalTax + i.price
      })
      this.shipping_lines.forEach(i => {
        totalShipping = totalShipping + i.price
      })

      this.total_tax = totalTax
      this.total_shipping = totalShipping

      this.total_price = Math.max(0,
        this.total_line_items_price
        + this.total_tax
        + this.total_shipping
        - this.total_discounts
        - this.total_coupons
        - this.total_overrides
      )

      // resolve current transactions
      return this.resolveTransactions({ transaction: options.transaction || null })
    })
    .then(() => {
      // reconcile the transactions
      return this.reconcileTransactions({ transaction: options.transaction || null })
    })
    .then(() => {
      // resolve the current fulfillments
      return this.resolveFulfillments({ transaction: options.transaction || null })
    })
    .then(() => {
      // Set the new Financial Status
      this.setFinancialStatus()
      // Set the new Fulfillment Status
      this.setFulfillmentStatus()
      // Set the new Overall Status
      this.setStatus()
      // Save the changes
      return this.save({transaction: options.transaction || null})
    })
}
/**
 *
 */
Order.prototype.sendCreatedEmail = function(options: {[key: string]: any} = {}) {
  let resEmail
  return this.app.emails.Order.created(this, {
    send_email: this.app.config.get('cart.emails.orderCreated')
  }, {
    transaction: options.transaction || null
  })
    .then(email => {
      resEmail = email
      return this.notifyCustomer(resEmail, {transaction: options.transaction || null})
    })
    .then(notification => {
      if (this.app.config.get('cart.notifications.admin.orderCreated')) {
        return this.app.services.ProxyCartService.notifyAdmins(resEmail, {transaction: options.transaction || null})
      }
      return notification
    })
    .catch(err => {
      this.app.log.error(err)
      return
    })
}
/**
 *
 */
Order.prototype.sendCancelledEmail = function(options: {[key: string]: any} = {}) {
  return this.app.emails.Order.cancelled(this, {
    send_email: this.app.config.get('cart.emails.orderCancelled')
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
Order.prototype.sendRefundedEmail = function(options: {[key: string]: any} = {}) {
  return this.app.emails.Order.refunded(this, {
    send_email: this.app.config.get('cart.emails.orderRefunded')
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
Order.prototype.sendPaidEmail = function(options: {[key: string]: any} = {}) {
  return this.app.emails.Order.paid(this, {
    send_email: this.app.config.get('cart.emails.orderPaid')
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
 * @param options
 * @returns {Promise.<T>}
 */
Order.prototype.sendPartiallyPaidEmail = function(options: {[key: string]: any} = {}) {

  return this.app.emails.Order.partiallyPaid(this, {
    send_email: this.app.config.get('cart.emails.orderPaid')
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
Order.prototype.sendUpdatedEmail = function(options: {[key: string]: any} = {}) {
  return this.app.emails.Order.updated(this, {
    send_email: this.app.config.get('cart.emails.orderUpdated')
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
