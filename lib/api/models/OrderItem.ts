import { FabrixApp } from '@fabrix/fabrix'
import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { values, isNumber, isString, isObject } from 'lodash'

import { INTERVALS } from '../../enums'
import { FULFILLMENT_STATUS } from '../../enums'
import { FULFILLMENT_SERVICE } from '../../enums'

export class OrderItemResolver extends SequelizeResolver {
  resolve(item, options: {[key: string]: any} = {}) {
    const OrderItemModel =  this
    if (item instanceof OrderItemModel.instance) {
      return Promise.resolve(item)
    }
    else if (item && isObject(item) && item.id) {
      return OrderItemModel.findById(item.id, options)
        .then(resOrderItem => {
          if (!resOrderItem) {
            throw new ModelError('E_NOT_FOUND', `Order ${item.id} not found`)
          }
          return resOrderItem
        })
    }
    else if (item && (isString(item) || isNumber(item))) {
      return OrderItemModel.findById(item, options)
        .then(resOrderItem => {
          if (!resOrderItem) {
            throw new ModelError('E_NOT_FOUND', `Order ${item} not found`)
          }
          return resOrderItem
        })
    }
    else {
      // TODO throw proper error
      const err = new Error('Unable to resolve Order Item')
      return Promise.reject(err)
    }
  }
}

/**
 * @module OrderItem
 * @description Order Item Model
 */
export class OrderItem extends Model {

  static get resolver() {
    return OrderItemResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          INTERVALS: INTERVALS,
          FULFILLMENT_STATUS: FULFILLMENT_STATUS,
          FULFILLMENT_SERVICE: FULFILLMENT_SERVICE
        },
        scopes: {
          live: {
            where: {
              live_mode: true
            }
          }
        },
        hooks: {
          beforeCreate: [
            (orderItem, options) => {
              return app.services.OrderService.itemBeforeCreate(orderItem, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          beforeSave: [
            (orderItem, options) => {
              return app.services.OrderService.itemBeforeSave(orderItem, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          beforeUpdate: [
            (orderItem, options) => {
              return app.services.OrderService.itemBeforeUpdate(orderItem, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          afterCreate: [
            (orderItem, options) => {
              return app.services.OrderService.itemAfterCreate(orderItem, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          afterUpdate: [
            (orderItem, options) => {
              return app.services.OrderService.itemAfterUpdate(orderItem, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          afterDestroy: [
            (orderItem, options) => {
              return app.services.OrderService.itemAfterDestroy(orderItem, options)
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
      order_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Order',
        //   key: 'id'
        // },
        allowNull: false
      },
      customer_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Customer',
        //   key: 'id'
        // }
        // allowNull: false
      },
      fulfillment_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Fulfillment',
        //   key: 'id'
        // }
        // allowNull: false
      },
      product_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Product',
        //   key: 'id'
        // },
        allowNull: false
      },
      product_handle: {
        type: Sequelize.STRING,
        // references: {
        //   model: 'Product',
        //   key: 'handle'
        // },
        allowNull: false
      },
      variant_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'ProductVariant',
        //   key: 'id'
        // },
        allowNull: false
      },
      subscription_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Subscription',
        //   key: 'id'
        // }
      },
      refund_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Refund',
        //   key: 'id'
        // }
      },
      gift_card_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'GiftCard',
        //   key: 'id'
        // }
      },
      shop_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Shop',
        //   key: 'id'
        // }
      },
      // The option that this Variant is
      option: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('OrderItem', app, Sequelize, 'option', {
      //   // name: string, value:string
      //   defaultValue: {}
      // }),
      // The amount available to fulfill.
      // This is the quantity
      // - max(refunded_quantity, fulfilled_quantity)
      // - pending_fulfilled_quantity
      // - open_fulfilled_quantity.
      fulfillable_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The maximum allowed per order.
      max_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: -1
      },
      // Service provider who is doing the fulfillment.
      // Valid values are either "manual" or the name of the provider. eg: "amazon", "shipwire", etc.
      fulfillment_service: {
        type: Sequelize.STRING,
        defaultValue: FULFILLMENT_SERVICE.MANUAL
        // allowNull: false
      },
      // How far along an order is in terms line items fulfilled.
      // Valid values are: pending, none, sent, fulfilled, or partial.
      fulfillment_status: {
        type: Sequelize.ENUM,
        values: values(FULFILLMENT_STATUS),
        defaultValue: FULFILLMENT_STATUS.PENDING
        // allowNull: false
      },
      // The weight of the item in grams.
      grams: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The MSRP
      compare_at_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The price of the item before discounts have been applied.
      price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The price of the item after discounts have been applied.
      calculated_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The Unit Price
      price_per_unit: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The unique numeric identifier for the product in the fulfillment.
      // Can be null if the original product associated with the order is deleted at a later date
      // The number of products that were purchased.
      quantity: {
        type: Sequelize.INTEGER
      },
      // States whether or not the fulfillment requires shipping. Values are: true or false.
      requires_taxes: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      // States whether or not the fulfillment requires shipping. Values are: true or false.
      requires_shipping: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      // States whether or not the order item requires a subscription. Values are: true or false.
      requires_subscription: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      // If Product has subscription, the interval of the subscription, defaults to 0 months
      subscription_interval: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // If product has subscription, the unit of the interval
      subscription_unit: {
        type: Sequelize.ENUM,
        values: values(INTERVALS),
        defaultValue: INTERVALS.NONE
      },
      // A unique identifier of the item in the fulfillment.
      sku: {
        type: Sequelize.STRING
      },
      // The type of Product
      type: {
        type: Sequelize.STRING
      },
      // The title of the product.
      title: {
        type: Sequelize.STRING
      },
      // The title of the product variant.
      variant_title: {
        type: Sequelize.STRING
      },
      // The id of the supplier of the item.
      vendor_id: {
        type: Sequelize.INTEGER
      },
      // The name of the product variant.
      name: {
        type: Sequelize.STRING
      },
      // States whether or not the line_item is a gift card. If so, the item is not taxed or considered for shipping charges.
      gift_card: {
        type: Sequelize.BOOLEAN
      },
      // An array of custom information for an item that has been added to the cart.
      // Often used to provide product customization options.
      // For more information, see the documentation on collecting customization information on the product page.
      properties: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('OrderItem', app, Sequelize, 'properties', {
      //   defaultValue: {}
      // }),
      property_pricing: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('OrderItem', app, Sequelize, 'property_pricing', {
      //   defaultValue: {}
      // }),
      // States whether or not the product was taxable. Values are: true or false.
      taxable: {
        type: Sequelize.BOOLEAN
      },
      tax_code: {
        type: Sequelize.STRING,
        defaultValue: 'P000000' // Physical Good
      },
      // The line_items that have discounts
      discounted_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('OrderItem', app, Sequelize, 'discounted_lines', {
      //   defaultValue: []
      // }),
      // The line_items that have discounts
      coupon_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('OrderItem', app, Sequelize, 'coupon_lines', {
      //   defaultValue: []
      // }),
      // The line_items that have shipping
      shipping_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('OrderItem', app, Sequelize, 'shipping_lines', {
      //   defaultValue: []
      // }),

      // A list of tax_line objects, each of which details the taxes applicable to this line_item.
      tax_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('OrderItem', app, Sequelize, 'tax_lines', {
      //   defaultValue: []
      // }),
      // The total discounts amount applied to this line item. This value is not subtracted in the line item price.
      total_discounts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total coupons amount applied to this line item. This value is not subtracted in the line item price.
      total_coupons: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total shipping amount applied to this line item. This value is not added in the line item price.
      total_shipping: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total taxes amount applied to this line item. This value is not added in the line item price.
      total_taxes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The Average Shipping Cost
      average_shipping: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Payment types that can not be used to purchase this product
      exclude_payment_types: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('OrderItem', app, Sequelize, 'exclude_payment_types', {
      //   defaultValue: []
      // }),

      // Product Images
      images: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('OrderItem', app, Sequelize, 'images', {
      //   defaultValue: []
      // }),

      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('cart.live_mode')
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id'
    })
    models.OrderItem.belongsTo(models.Customer, {
      foreignKey: 'customer_id'
    })
    models.OrderItem.belongsTo(models.Fulfillment, {
      foreignKey: 'fulfillment_id'
    })
    models.OrderItem.belongsTo(models.Product, {
      foreignKey: 'product_id'
    })
    models.OrderItem.belongsTo(models.ProductVariant, {
      foreignKey: 'variant_id'
    })
    models.OrderItem.belongsTo(models.Vendor, {
      foreignKey: 'vendor_id'
    })
    models.OrderItem.belongsTo(models.Refund, {
      foreignKey: 'refund_id'
    })
    models.OrderItem.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
    })
    models.OrderItem.belongsTo(models.GiftCard, {
      foreignKey: 'gift_card_id'
    })

    models.OrderItem.belongsToMany(models.Discount, {
      as: 'discounts',
      through: {
        model: models.ItemDiscount,
        unique: false,
        scope: {
          model: 'order_item'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })

    models.OrderItem.hasOne(models.Metadata, {
      as: 'metadata',
      foreignKey: 'order_item_id'
    })
  }
}

export interface OrderItem {
  resetDefaults(app: FabrixApp): any
  addShipping(shipping, options): any
  removeShipping(shipping, options): any
  setItemsShippingLines(shippingLine): any
  setShippingLines(lines): any
  setItemsTaxLines(taxedLine): any
  setTaxLines(lines): any
  setProperties(prev): any
  setTotals(app: FabrixApp): any
  recalculate(options): any
  reconcileFulfillment(options): any
}

/**
 * Resets the defaults so they can be recalculated
 * @returns {*}
 */
OrderItem.prototype.resetDefaults = function() {
  this.calculated_price = 0
  this.total_discounts = 0
  this.total_shipping = 0
  this.total_coupons = 0
  this.total_taxes = 0

  return this
}
/**
 *
 */
OrderItem.prototype.addShipping = function(shipping, options: {[key: string]: any} = {}) {
 return this
}
/**
 *
 */
OrderItem.prototype.removeShipping = function(shipping, options: {[key: string]: any} = {}) {
  return this
}

/**
 *
 */
OrderItem.prototype.setItemsShippingLines = function(shippingedLine) {
  // this.shipping_lines = []
  let shippingesLines = []
  let totalShippinges = 0
  // Make this an array if null
  if (shippingedLine) {

    shippingedLine.shipping_lines = shippingedLine.shipping_lines || []
    shippingedLine.shipping_lines.map(line => {
      line.id = this.id
      return line
    })

    totalShippinges = shippingedLine.shipping_lines.forEach(line => {
      totalShippinges = totalShippinges + line.price
    })

    shippingesLines = [...shippingesLines, ...shippingedLine.shipping_lines]
  }
  this.shipping_lines = shippingesLines

  return this.setShippingLines(shippingesLines)
}

/**
 *
 */
OrderItem.prototype.setShippingLines = function(lines = []) {
  this.total_shipping = 0
  this.shipping_lines = lines
  this.shipping_lines.forEach(line => {
    this.total_shipping = this.total_shipping + line.price
  })
  return this
  // return this.setTotals()
}

/**
 *
 */
OrderItem.prototype.setItemsTaxLines = function(taxedLine) {
  // this.tax_lines = []
  let taxesLines = []
  let totalTaxes = 0
  // Make this an array if null
  if (taxedLine) {

    taxedLine.tax_lines = taxedLine.tax_lines || []
    taxedLine.tax_lines.map(line => {
      line.id = this.id
      return line
    })

    totalTaxes = taxedLine.tax_lines.forEach(line => {
      totalTaxes = totalTaxes + line.price
    })

    taxesLines = [...taxesLines, ...taxedLine.tax_lines]
  }
  this.tax_lines = taxesLines

  return this.setTaxLines(taxesLines)
}

/**
 *
 * @param lines
 */
OrderItem.prototype.setTaxLines = function(lines = []) {
  this.total_tax = 0
  this.tax_lines = lines
  this.tax_lines.forEach(line => {
    this.total_tax = this.total_tax + line.price
  })
  return this
  // return this.setTotals()
},

OrderItem.prototype.setProperties = function(prev) {

  if (this.properties && prev) {
    // Remove any old property pricing
    for (const l in prev.properties) {
      if (prev.properties.hasOwnProperty(l)) {
        this.price = this.price - (prev.properties[l].price || 0)
        this.price_per_unit = this.price_per_unit - (prev.properties[l].price || 0)
      }
    }
    // and then add the new properties in
    for (const l in this.properties) {
      if (this.properties.hasOwnProperty(l)) {
        this.price = this.price + (this.properties[l].price || 0)
        this.price_per_unit = this.price_per_unit + (this.properties[l].price || 0)
      }
    }
  }
  return this
}

/**
 *
 */
OrderItem.prototype.setTotals = function() {
  // Set Cart values
  // this.total_price = Math.max(0,
  //   this.total_tax
  //   + this.total_shipping
  //   + this.subtotal_price
  // )

  return this
}

/**
 *
 */
OrderItem.prototype.recalculate = function(options: {[key: string]: any} = {}) {
  if (
    this.changed('price')
    || this.changed('quantity')
    || this.changed('properties')
    || this.changed('discounted_lines')
    || this.changed('coupon_lines')
    || this.changed('tax_lines')
    || this.changed('coupon_lines')
  ) {
    // this.app.log.debug('ORDER ITEM CHANGED', this.id, Object.keys(this.previous()))

    let totalDiscounts = 0
    let totalShipping = 0
    let totalTaxes = 0
    let totalCoupons = 0

    if (this.changed('properties')) {
      this.setProperties(this.previous('properties'))
    }

    this.discounted_lines = this.discounted_lines || []
    this.discounted_lines.map(line => {
      totalDiscounts = totalDiscounts + (line.price || 0)
      return line
    })

    this.coupon_lines = this.coupon_lines || []
    this.coupon_lines.map(line => {
      totalCoupons = totalCoupons + (line.price || 0)
      if (line.line) {
        line.line = this.id
      }
      return line
    })

    this.shipping_lines = this.shipping_lines || []
    this.shipping_lines.map(line => {
      totalShipping = totalShipping + (line.price || 0)
      if (line.line) {
        delete line.line
        line.id = this.id
      }
      return line
    })

    this.tax_lines = this.tax_lines || []
    this.tax_lines.map(line => {
      totalTaxes = totalTaxes + (line.price || 0)
      if (line.line) {
        delete line.line
        line.id = this.id
      }
      return line
    })
    const calculatedPrice = Math.max(0, (this.price_per_unit * this.quantity) - totalDiscounts - totalCoupons)

    this.calculated_price = calculatedPrice
    this.total_discounts = totalDiscounts
    this.total_shipping = totalShipping
    this.total_coupons = totalCoupons
    this.total_taxes = totalTaxes

    return Promise.resolve(this)
  }
  else {
    return Promise.resolve(this)
  }
}
/**
 *
 */
OrderItem.prototype.reconcileFulfillment = function(options: {[key: string]: any} = {}) {
  if (this.isNewRecord && !this.fulfillment_id) {
    return this.save({transaction: options.transaction || null})
      .then(() => {
        return this.app.services.FulfillmentService.addOrCreateFulfillmentItem(
          this,
          { transaction: options.transaction || null }
        )
      })
      .then(() => {
        return this
      })
  }
  else if (!this.isNewRecord && this.quantity === 0) {
    return this.save({transaction: options.transaction || null})
      .then(() => {
        return this.app.services.FulfillmentService.removeFulfillmentItem(
          this,
          { transaction: options.transaction || null }
        )
      })
      .then(() => {
        return this
      })
  }
  else if (!this.isNewRecord && this.changed('quantity') && (this.quantity > this.previous('quantity'))) {
    return this.save({transaction: options.transaction || null})
      .then(() => {
        return this.app.services.FulfillmentService.updateFulfillmentItem(
          this,
          {transaction: options.transaction || null}
        )
      })
      .then(() => {
        return this
      })
  }
  else if (!this.isNewRecord && this.changed('quantity') && (this.quantity < this.previous('quantity'))) {
    return this.save({transaction: options.transaction || null})
      .then(() => {
        return this.app.services.FulfillmentService.removeFulfillmentItem(
          this,
          { transaction: options.transaction || null }
        )
      })
      .then(() => {
        return this
      })
  }
  else {
    // Unhandled Case
    return this.save({transaction: options.transaction || null})
  }
}
