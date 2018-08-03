import { FabrixApp } from '@fabrix/fabrix'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { defaultsDeep, isObject, isNumber, isString, values } from 'lodash'

const queryDefaults = require('../utils/queryDefaults')
import { FULFILLMENT_STATUS } from '../../enums'
import { FULFILLMENT_SERVICE } from '../../enums'

export class FulfillmentResolver extends SequelizeResolver {

  findByIdDefault(id, options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      queryDefaults.Fulfillment.default(this.app),
      options
    )
    return this.findById(id, options)
  }

  findAndCountDefault(options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      queryDefaults.Fulfillment.default(this.app),
      options
    )
    return this.findAndCountAll(options)
  }
  /**
   * Resolve by instance Function
   * @param cart
   * @param options
   */
  resolveByInstance (cart, options: {[key: string]: any} = {}) {
    return Promise.resolve(cart)
  }
  /**
   * Resolve by id Function
   * @param cart
   * @param options
   */
  resolveById (cart, options: {[key: string]: any} = {}) {
    return this.findById(cart.id, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart ${cart.id} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by token Function
   * @param cart
   * @param options
   */
  resolveByToken (cart, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        token: cart.token
      }
    }, options))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart token ${cart.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by number Function
   * @param cart
   * @param options
   */
  resolveByNumber (cart, options: {[key: string]: any} = {}) {
    return this.findById(cart, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart ${cart.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by string Function
   * @param cart
   * @param options
   */
  resolveByString (cart, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        token: cart
      }
    }, options))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart ${cart} not found`)
        }
        return resUser
      })
  }
  /**
   * Primary Resolve Function
   * @param cart
   * @param options
   */
  resolve(cart, options: {[key: string]: any} = {}) {
    const resolvers = {
      'instance': cart instanceof this.instance,
      'id': !!(cart && isObject(cart) && cart.id),
      'token': !!(cart && isObject(cart) && cart.token),
      'number': !!(cart && isNumber(cart)),
      'string': !!(cart && isString(cart))
    }
    const type = Object.keys(resolvers).find((key) => resolvers[key])

    switch (type) {
      case 'instance': {
        return this.resolveByInstance(cart, options)
      }
      case 'id': {
        return this.resolveById(cart, options)
      }
      case 'token': {
        return this.resolveByToken(cart, options)
      }
      case 'number': {
        return this.resolveByNumber(cart, options)
      }
      case 'string': {
        return this.resolveByString(cart, options)
      }
      default: {
        // TODO create proper error
        const err = new Error(`Unable to resolve Cart ${cart}`)
        return Promise.reject(err)
      }
    }
  }
}

/**
 * @module Fulfillment
 * @description Fulfillment Model
 */
export class Fulfillment extends Model {
  static get resolver() {
    return FulfillmentResolver
  }

  /**
   *
   * @param app
   * @param Sequelize
   * @returns {{}}
   */
  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          FULFILLMENT_STATUS: FULFILLMENT_STATUS,
          FULFILLMENT_SERVICE: FULFILLMENT_SERVICE
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
          none: {
            where: {
              status: FULFILLMENT_STATUS.NONE
            }
          },
          pending: {
            where: {
              status: FULFILLMENT_STATUS.PENDING
            }
          },
          sent: {
            where: {
              status: FULFILLMENT_STATUS.SENT
            }
          },
          partial: {
            where: {
              status: FULFILLMENT_STATUS.PARTIAL
            }
          },
          fulfilled: {
            where: {
              status: FULFILLMENT_STATUS.FULFILLED
            }
          },
          cancelled: {
            where: {
              status: FULFILLMENT_STATUS.CANCELLED
            }
          },
        },
        hooks: {
          beforeCreate: [
            (fulfillment, options) => {
              return app.services.FulfillmentService.beforeCreate(fulfillment, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          beforeUpdate: [
            (fulfillment, options) => {
              return app.services.FulfillmentService.beforeUpdate(fulfillment, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          afterCreate: [
            (fulfillment, options) => {
              return app.services.FulfillmentService.afterCreate(fulfillment, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          afterUpdate: [
            (fulfillment, options) => {
              return app.services.FulfillmentService.afterUpdate(fulfillment, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ]
        }
      }
    }
  }

  /**
   *
   * @param app
   * @param Sequelize
   * @returns {{}}
   */
  static schema (app, Sequelize) {
    return {
      order_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Order',
        //   key: 'id'
        // },
        allowNull: false
      },
      // The receipt given by fulfillment service
      receipt: {
        type: Sequelize.TEXT
      },
      // The status of the fulfillment:
      // pending: in process of doing something
      // none: nothing has happened
      // sent: the fulfillment has been sent to fulfillment service
      // fulfilled: has been fulfilled
      // partial: has been partially fulfilled (in case of split orders)
      // cancelled: has been cancelled
      status: {
        type: Sequelize.ENUM,
        values: values(FULFILLMENT_STATUS),
        defaultValue: FULFILLMENT_STATUS.PENDING
      },
      // The total number of order items in this instance
      total_items: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Total Order Items Fulfilled
      total_fulfilled: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Total Order Items Sent to Fulfillment
      total_sent_to_fulfillment: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Total Order Items Cancelled by Fulfillment
      total_cancelled: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Total Order Items not Fulfilled
      total_pending_fulfillments: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The URL pointing to the order status web page.
      status_url: {
        type: Sequelize.STRING
      },
      // If this fulfillment contains items that need to be shipped.
      has_shipping: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // The name of the fulfillment service provider
      service: {
        type: Sequelize.STRING,
        defaultValue: FULFILLMENT_SERVICE.MANUAL
      },
      // The name of the tracking company.
      tracking_company: {
        type: Sequelize.STRING
      },
      // The shipping number, provided by the shipping company.
      tracking_number: {
        type: Sequelize.STRING
      },
      // Extra attributes in JSON to send to fulfillment:
      // Create a return label to be included in the shipment
      // "include_return_label": true,
      // If a signature confirmation is required
      // "require_signature_confirmation": true,
      // "insurance": {
      //   "amount": "200",
      //   "currency": "USD",
      //   "provider": "FEDEX"
      //   "content": "t-shirts"
      // },
      // "alcohol": {
      //   "contains_alcohol": true, // boolean
      //   "recipient_type": "licensee" //
      // },
      // "dry_ice": {
      //   "contains_dry_ice": true, // boolean
      //   "weight": "0.1" // Weight in grams
      // }
      extras: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('Fulfillment', app, Sequelize, 'extras', {
      //   defaultValue: {}
      // }),
      // Live mode
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('engine.live_mode')
      },
      // Date time sent to fulfillment at
      sent_at: {
        type: Sequelize.DATE
      },
      // Date time fulfilled at
      fulfilled_at: {
        type: Sequelize.DATE
      },
      // Date time cancelled at
      cancelled_at: {
        type: Sequelize.DATE
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.Fulfillment.belongsTo(models.Order, {
      foreignKey: 'order_id',
      // allowNull: false
    })
    models.Fulfillment.hasMany(models.OrderItem, {
      as: 'order_items',
      foreignKey: 'fulfillment_id',
    })
  }
}

export interface Fulfillment {
  pending(): any
  none(): any
  partial(): any
  sent(): any
  fulfilled(): any
  cancelled(): any
  fulfillUpdate(data, options): any
  reconcileFulfillmentStatus(options): any
  resolveFulfillmentStatus(options): any
  resolveOrderItems(options): any
  saveFulfillmentStatus(options): any
  setFulfillmentStatus(options): any
}

/**
 *
 * @returns {*}
 */
Fulfillment.prototype.pending = function() {
  return this
}
/**
 *
 * @returns {*}
 */
Fulfillment.prototype.none = function() {
  return this
}
/**
 *
 * @returns {*}
 */
Fulfillment.prototype.partial = function() {
  return this
}
/**
 *
 * @returns {*}
 */
Fulfillment.prototype.sent = function() {
  this.sent_at = new Date(Date.now())
  this.status = FULFILLMENT_STATUS.SENT
  return this
}
/**
 *
 * @returns {*}
 */
Fulfillment.prototype.fulfilled = function() {
  this.fulfilled_at = new Date(Date.now())
  this.status = FULFILLMENT_STATUS.FULFILLED
  return this
}
/**
 *
 * @returns {*}
 */
Fulfillment.prototype.cancelled = function() {
  this.cancelled_at = new Date(Date.now())
  this.status = FULFILLMENT_STATUS.CANCELLED
  return this
}
/**
 *
 */
Fulfillment.prototype.fulfillUpdate = function(data = {}, options: {[key: string]: any} = {}) {
  return this.resolveOrderItems({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      this.status = data.status || this.status
      this.status_url = data.status_url || this.status_url
      this.tracking_company = data.tracking_company || this.tracking_company
      this.tracking_number = data.tracking_number || this.tracking_number
      this.extras = data.extras || this.extras
      this.receipt = data.receipt || this.receipt

      return this.sequelize.Promise.mapSeries(this.order_items, item => {
        item.fulfillment_status = this.status
        return item.save({
          fields: ['fulfillment_status'],
          transaction: options.transaction || null
        })
      })
    })
    .then(() => {
      return this.saveFulfillmentStatus({transaction: options.transaction || null})
    })
}
/**
 *
 */
Fulfillment.prototype.reconcileFulfillmentStatus = function(options: {[key: string]: any} = {}) {
  return this.resolveFulfillmentStatus({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      if (this.changed('status')) {
        return this.getOrder({transaction: options.transaction || null})
      }
      else {
        return null
      }
    })
    .then(resOrder => {
      if (resOrder) {
        return resOrder.saveFulfillmentStatus({transaction: options.transaction || null})
      }
      else {
        return null
      }
    })
    .then(resOrder => {
      if (resOrder) {
        // Save the status changes
        return resOrder.saveStatus({transaction: options.transaction || null})
      }
      else {
        return null
      }
    })
    .then(() => {
      return this
    })
}
/**
 *
 */
Fulfillment.prototype.resolveFulfillmentStatus = function(options: {[key: string]: any} = {}) {
  // let currentStatus, previousStatus
  if (!this.id) {
    return Promise.resolve(this)
  }
  return this.resolveOrderItems({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      this.setFulfillmentStatus()
      return this
    })
}
/**
 *
 */
Fulfillment.prototype.resolveOrderItems = function(options: {[key: string]: any}) {
  if (
    this.order_items
    && this.order_items.every(i => i instanceof this.app.models['OrderItem'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getOrder_items({transaction: options.transaction || null})
      .then(orderItems => {

        orderItems = orderItems || []
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
Fulfillment.prototype.saveFulfillmentStatus = function(options: {[key: string]: any} = {}) {
  return this.resolveFulfillmentStatus({
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      return this.save({transaction: options.transaction || null})
    })
}
/**
 *
 * @returns {*}
 */
Fulfillment.prototype.setFulfillmentStatus = function() {
  if (!this.order_items) {
    throw new Error('Fulfillment.setFulfillmentStatus requires order_items to be populated')
  }

  let fulfillmentStatus = FULFILLMENT_STATUS.PENDING
  let totalFulfillments = 0
  let totalPartialFulfillments = 0
  let totalSentFulfillments = 0
  let totalNonFulfillments = 0
  let totalPendingFulfillments = 0
  let totalCancelledFulfillments = 0
  let totalQty = 0

  this.order_items.forEach(item => {
    totalQty = totalQty + item.quantity

    if (item.fulfillment_status === FULFILLMENT_STATUS.FULFILLED) {
      totalFulfillments = totalFulfillments + item.quantity
    }
    else if (item.fulfillment_status === FULFILLMENT_STATUS.PARTIAL) {
      totalPartialFulfillments = totalPartialFulfillments + item.quantity
    }
    else if (item.fulfillment_status === FULFILLMENT_STATUS.SENT) {
      totalSentFulfillments = totalSentFulfillments + item.quantity
    }
    else if (item.fulfillment_status === FULFILLMENT_STATUS.PENDING) {
      totalPendingFulfillments = totalPendingFulfillments + item.quantity
    }
    else if (item.fulfillment_status === FULFILLMENT_STATUS.NONE) {
      totalNonFulfillments = totalNonFulfillments + item.quantity
    }
    else if (item.fulfillment_status === FULFILLMENT_STATUS.CANCELLED) {
      totalCancelledFulfillments = totalCancelledFulfillments + item.quantity
    }
  })

  if (totalFulfillments === totalQty && totalQty > 0) {
    fulfillmentStatus = FULFILLMENT_STATUS.FULFILLED
  }
  else if (totalSentFulfillments === totalQty && totalQty > 0) {
    fulfillmentStatus = FULFILLMENT_STATUS.SENT
  }
  else if (totalPartialFulfillments > 0 && totalQty > 0) {
    fulfillmentStatus = FULFILLMENT_STATUS.PARTIAL
  }
  else if (totalPendingFulfillments === totalQty && totalQty > 0) {
    fulfillmentStatus = FULFILLMENT_STATUS.PENDING // back to default
  }
  else if (totalNonFulfillments === totalQty && totalQty > 0) {
    fulfillmentStatus = FULFILLMENT_STATUS.NONE // back to default
  }
  else if (totalCancelledFulfillments === totalQty && totalQty > 0) {
    fulfillmentStatus = FULFILLMENT_STATUS.CANCELLED
  }

  this.has_shipping = this.order_items.some(i => i.requires_shipping === true)
  this.status = fulfillmentStatus
  this.total_items = totalQty
  this.total_fulfilled = totalFulfillments
  this.total_sent_to_fulfillment = totalSentFulfillments
  this.total_pending_fulfillments = totalPendingFulfillments
  this.total_cancelled = totalCancelledFulfillments
  return this
}
