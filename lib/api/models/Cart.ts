import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { defaultsDeep, isObject, isNumber, isString, isArray, findIndex, values, sumBy, merge } from 'lodash'
import { FabrixApp } from '@fabrix/fabrix'

import { CART_STATUS } from '../../enums'
import { DISCOUNT_STATUS } from '../../enums'
import { PAYMENT_PROCESSING_METHOD } from '../../enums'
import { Cart as CartQuery } from '../utils/queryDefaults'

export class CartResolver extends SequelizeResolver {
  /**
   *
   * @param id
   * @param options
   * @returns {*|Promise.<Instance>}
   */
  findByIdDefault(id, options = {}) {
    if (typeof id !== 'number' && typeof id !== 'string') {
      throw new Error('Id was not a string or a number')
    }
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      CartQuery.default(this.app),
      options
    )
    return this.findById(id, options)
  }
  /**
   *
   * @param options
   * @returns {*|Promise.<Instance>}
   */
  findOneDefault(options: {[key: string]: any} = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      CartQuery.default(this.app),
      options
    )
    return this.findOne(options)
  }
  /**
   *
   * @param token
   * @param options
   * @returns {*|Promise.<Instance>}
   */
  findByTokenDefault(token, options: {[key: string]: any} = {}) {
    if (typeof token !== 'string') {
      throw new Error('Token is not a string')
    }
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      CartQuery.default(this.app),
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
    if (!(cart instanceof Object)) {
      return Promise.reject(new Error('resolveById requires an object with an id property'))
    }
    return this.findByIdDefault(cart.id, options)
      .then(resCart => {
        if (!resCart && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart ${cart.id} not found`)
        }
        return resCart
      })
  }
  /**
   * Resolve by token Function
   * @param cart
   * @param options
   */
  resolveByToken (cart, options: {[key: string]: any} = {}) {
    if (!(cart instanceof Object)) {
      return Promise.reject(new Error('resolveByToken requires an object with a token property'))
    }
    if (!(cart.token)) {
      return Promise.reject(new Error('resolveByToken requires an object with a token property'))
    }
    return this.findByTokenDefault(cart.token, options)
      .then(resCart => {
        if (!resCart && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart token ${cart.token} not found`)
        }
        return resCart
      })
  }
  /**
   * Resolve by number Function
   * @param cart
   * @param options
   */
  resolveByNumber (cart, options: {[key: string]: any} = {}) {
    return this.findByIdDefault(cart, options)
      .then(resCart => {
        if (!resCart && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart ${cart.token} not found`)
        }
        return resCart
      })
  }
  /**
   * Resolve by string Function
   * @param cart
   * @param options
   */
  resolveByString (cart, options: {[key: string]: any} = {}) {
    return this.findByTokenDefault(cart, options)
      .then(resCart => {
        if (!resCart && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart ${cart} not found`)
        }
        return resCart
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
      'create': !!(cart && isObject(cart) && options.create !== false),
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
      // case 'email': {
      //   return this.resolveByEmail(cart, options)
      // }
      case 'create': {
        return this.create(cart, options)
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
 * @module Cart
 * @description Cart Model
 */
export class Cart extends Model {

  static get resolver() {
    return CartResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        enums: {
          CART_STATUS: CART_STATUS
        },
        underscored: true,
        // defaultScope: {
        //   where: {
        //     live_mode: app.config.get('cart.live_mode')
        //   }
        // },
        scopes: {
          live: {
            where: {
              live_mode: true
            }
          }
        },
        indexes: [
          // Creates a gin index on data with the jsonb_path_ops operator
          {
            fields: ['line_items'],
            using: 'gin',
            operator: 'jsonb_path_ops'
          },
          {
            fields: ['client_details'],
            using: 'gin',
            operator: 'jsonb_path_ops'
          }
        ],
        hooks: {
          beforeCreate: [
            (cart, options) => {
              return app.services.CartService.beforeCreate(cart, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          beforeUpdate: [
            (cart, options) => {
              return app.services.CartService.beforeUpdate(cart, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          beforeSave: [
            (cart, options) => {
              return app.services.CartService.beforeSave(cart, options)
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
      customer_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Customer',
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
      order_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Shop',
        //   key: 'id'
        // }
      },
      billing_address_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Shop',
        //   key: 'id'
        // }
      },
      shipping_address_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Shop',
        //   key: 'id'
        // }
      },
      // Unique identifier for a particular cart.
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      // The status of the cart defaults to 'open'
      status: {
        type: Sequelize.ENUM,
        values: values(CART_STATUS),
        defaultValue: CART_STATUS.OPEN
      },
      // The three letter code (ISO 4217) for the currency used for the payment.
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD'
      },
      // The items in the cart
      line_items: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Cart', app, Sequelize, 'line_items', {
      //   defaultValue: []
      // }),
      // Price of the checkout before shipping and taxes
      subtotal_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The line_items that have discounts
      discounted_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Cart', app, Sequelize, 'discounted_lines', {
      //   defaultValue: []
      // }),
      // The line_items that have discounts
      coupon_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Cart', app, Sequelize, 'coupon_lines', {
      //   defaultValue: []
      // }),
      // The line_items that require shipping
      shipping_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Cart', app, Sequelize, 'shipping_lines', {
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
      //   helpers.JSONB('Cart', app, Sequelize, 'shipping_rate', {
      //   defaultValue: []
      // }),
      // An array of shipping_rate objects, each of which details the shipping methods available.
      shipping_rates: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Cart', app, Sequelize, 'shipping_rates', {
      //   defaultValue: []
      // }),
      // If this cart contains an item that requires a subscription
      has_subscription: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // If this cart contains an item that requires shipping
      has_shipping: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // If this cart contains an item that requires taxes
      has_taxes: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // Total Items in Cart
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
      //   helpers.JSONB('Cart', app, Sequelize, 'tax_lines', {
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
      // The total monetary amount of discounts applied
      total_discounts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total monetary amount coupons applied
      total_coupons: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Array of pricing overrides objects
      pricing_overrides: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Cart', app, Sequelize, 'pricing_overrides', {
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
      // The total original price of the line items
      total_line_items_price: {
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
      // IP addresses
      ip: {
        type: Sequelize.STRING
      },
      create_ip: {
        type: Sequelize.STRING
      },
      update_ip: {
        type: Sequelize.STRING
      },
      // The request details of the customer you are processing the checkout on behalf of.
      client_details: {
        type: Sequelize.JSONB,
        defaultValue: {
          'accept_language': null,
          'browser_height': null,
          'browser_ip': '0.0.0.0',
          'browser_width': null,
          'session_hash': null,
          'user_agent': null
        }
      },
      //   helpers.JSONB('Cart', app, Sequelize, 'client_details', {
      //   defaultValue: {
      //     'accept_language': null,
      //     'browser_height': null,
      //     'browser_ip': '0.0.0.0',
      //     'browser_width': null,
      //     'session_hash': null,
      //     'user_agent': null
      //   }
      // }),
      // The reservation time in seconds for the products in the line items.
      // This can be set up to 5 minutes, or 1 hour depending on the authentication type used.
      reservation_time: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The time in seconds that the products in the line items will be held. If the reservation time expires,
      // the products may not be available and completion may fail.
      reservation_time_left: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Notes Supplied by customer
      notes: {
        type: Sequelize.TEXT
      },
      // Live Mode
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
   public static associate(models) {
    models.Cart.belongsTo(models.Customer, {
      foreignKey: 'customer_id'
      // as: 'customer_id',
    })
    models.Cart.belongsTo(models.Shop, {
      foreignKey: 'shop_id'
      // as: 'shop_id',
    })
    models.Cart.belongsTo(models.Order, {
      foreignKey: 'order_id'
      // as: 'shop_id',
    })

    models.Cart.belongsToMany(models.User, {
      as: 'owners',
      through: {
        model: models.UserItem,
        scope: {
          item: 'cart'
        }
      },
      foreign_id: 'item_id',
      constraints: false
    })
    models.Cart.belongsTo(models.Address, {
      as: 'shipping_address',
      foreignKey: 'shipping_address_id'
    })
    models.Cart.belongsTo(models.Address, {
      as: 'billing_address',
      foreignKey: 'billing_address_id'
    })
    models.Cart.belongsToMany(models.Address, {
      as: 'addresses',
      // otherKey: 'address_id',
      foreignKey: 'model_id',
      through: {
        model: models.ItemAddress,
        scope: {
          model: 'cart'
        },
        constraints: false
      },
      constraints: false
    })
    models.Cart.belongsToMany(models.Discount, {
      as: 'discounts',
      through: {
        model: models.ItemDiscount,
        unique: false,
        scope: {
          model: 'cart'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })
    // models.Cart.belongsTo(models.Customer, {
    //   foreignKey: 'default_cart'
    //   // as: 'customer_id'
    // })
    // models.Cart.hasMany(models.Product, {
    //   as: 'products'
    //   // constraints: false
    // })
    // models.Cart.hasMany(models.ProductVariant, {
    //   as: 'variants'
    //   // constraints: false
    // })
    // models.Cart.hasMany(models.Coupon, {
    //   as: 'coupons'
    //   // constraints: false
    // })
    // models.Cart.hasMany(models.GiftCard, {
    //   as: 'gift_cards'
    //   // constraints: false
    // })
  }
}


export interface Cart {
  resetDefaults(): any
  setLineItems( lines): any
  setItemDiscountedLines( item, discount, criteria ): any
  setItemsDiscountedLines( discounts, criteria): any
  setDiscountedLines( lines): any
  setPricingOverrides( lines): any
  setCouponLines( lines): any
  setItemsShippingLines( items): any
  setShippingLines( lines): any
  setItemsTaxLines( items): any
  setTaxLines( lines): any
  setTotals(): any
  setLineProperties( lines): any
  line( data): any
  addLine(item, qty, properties, shop, options): any
  removeLine(item, qty, options): any
  addShipping(shipping, options): any
  removeShipping(shipping, options): any
  addTaxes(taxes, options): any
  removeTaxes(taxes, options): any
  close(status, save): any
  draft(status, save): any
  clear(): any
  ordered(order, save): any
  buildOrder( options): any
  calculatePricingOverrides(options): any
  calculateDiscounts(options): any
  calculateShipping(options): any
  calculateTaxes(options): any
  recalculate(options): any
  resolveCustomer(options): any
  resolveCustomerAndItemCollections(options): any
  resolveDiscounts(options): any
  getCollectionPairs(options): any
  resolveShippingAddress(options): any
  resolveBillingAddress(options): any
  updateShippingAddress(address, options): any
  updateBillingAddress(address, options): any
}

/**
 * Resets the defaults so they can be recalculated
 * @returns {*}
 */
Cart.prototype.resetDefaults = function() {
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

  this.has_subscription = false
  this.has_shipping = false
  this.has_taxes = false
  this.discounted_lines = []
  this.coupon_lines = []

  // this.shipping_lines = []
  // this.tax_lines = []

  // Filter any non manual tax lines
  this.tax_lines = this.tax_lines.filter(line =>
    Object.keys(line).indexOf('line') === -1
  )

  // Filter any non manual shipping lines
  this.shipping_lines = this.shipping_lines.filter(line =>
    Object.keys(line).indexOf('line') === -1
  )

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
Cart.prototype.setLineItems = function(lines = []) {
  this.line_items = lines

  this.total_items = 0
  this.subtotal_price = 0
  this.total_line_items_price = 0
  this.has_shipping = this.line_items.some(item => item.requires_shipping)
  this.has_taxes = this.line_items.some(item => item.requires_taxes)
  this.line_items.forEach(item => {
    // Check if at least one time requires shipping
    if (item.requires_shipping) {
      this.total_weight = this.total_weight + item.grams
    }

    // Check if at least one item requires subscription
    if (item.requires_subscription) {
      this.has_subscription = true
    }

    this.total_items = this.total_items + item.quantity
    this.subtotal_price = this.subtotal_price + item.price
    this.total_line_items_price = this.total_line_items_price + item.price
  })
  return this.setTotals()
}
/**
 *
 */
Cart.prototype.setItemDiscountedLines = function(item, discount, criteria) {
  if (!(discount instanceof this.app.models['Discount'].instance)) {
    throw new Error('setItemDiscountedLines expects discount parameter to be a Discount Instance')
  }
  item = discount.discountItem(item, criteria)
  return item
}
/**
 *
 */
Cart.prototype.setItemsDiscountedLines = function (discounts, criteria) {
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
Cart.prototype.setDiscountedLines = function(lines = []) {
  this.total_discounts = 0
  this.discounted_lines = lines
  this.discounted_lines.forEach(line => {
    this.total_discounts = this.total_discounts + line.price
  })
  return this.setTotals()
}

/**
 *
 * @param lines
 */
Cart.prototype.setPricingOverrides = function(lines = []) {
  this.total_overrides = 0
  this.pricing_overrides = lines
  this.pricing_overrides.forEach(line => {
    this.total_overrides = this.total_overrides + line.price
  })
  return this.setTotals()
}

/**
 *
 * @param lines
 */
Cart.prototype.setCouponLines = function(lines = []) {
  this.total_coupons = 0
  this.coupon_lines = lines
  this.coupon_lines.forEach(line => {
    this.total_coupons = this.total_coupons + line.price
  })
  return this.setTotals()
}

Cart.prototype.setItemsShippingLines = function (items) {
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
Cart.prototype.setShippingLines = function(lines = []) {
  this.total_shipping = 0
  this.shipping_lines = [...this.shipping_lines, ...lines],
    this.shipping_lines.forEach(line => {
      this.total_shipping = this.total_shipping + line.price
    })
  return this.setTotals()
}
/**
 *
 */
Cart.prototype.setItemsTaxLines = function (items) {
  let taxesLines = []
  let totalTaxes = 0
  // Make this an array if null
  this.line_items = this.line_items || []

  this.line_items = this.line_items.map((item, i) => {
    const taxedLine = items.find(ii => ii.sku === item.sku)
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
Cart.prototype.setTaxLines = function(lines = []) {
  this.total_tax = 0
  this.tax_lines = [...this.tax_lines, ...lines]
  this.tax_lines.forEach(line => {
    this.total_tax = this.total_tax + line.price
  })
  return this.setTotals()
}

/**
 *
 */
Cart.prototype.setTotals = function() {
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
/**
 *
 */
Cart.prototype.setLineProperties = function(line) {
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
  // TODO Select Vendor
Cart.prototype.line = function(data) {
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
    shop_id: data.shop_id,
    product_id: data.product_id,
    product_handle: data.Product.handle,
    variant_id: data.id || data.variant_id,
    type: data.type,
    sku: data.sku,
    title: data.Product.title,
    variant_title: data.title,
    name: data.title === data.Product.title ? data.title : `${data.Product.title} - ${data.title}`,
    properties: properties,
    property_pricing: data.property_pricing,
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
    total_discounts: 0,
    requires_subscription: data.requires_subscription,
    subscription_interval: data.subscription_interval,
    subscription_unit: data.subscription_unit,
    weight: data.weight * data.quantity,
    weight_unit: data.weight_unit,
    images: data.images.length > 0 ? data.images : data.Product.images,
    quantity: data.quantity,
    fulfillable_quantity: data.fulfillable_quantity,
    max_quantity: data.max_quantity,
    grams: this.app.services.ProxyCartService.resolveConversion(data.weight, data.weight_unit) * data.quantity,
    vendors: data.Product.vendors,
    vendor_id: data.vendor_id || null,
    average_shipping: data.Product.average_shipping,
    exclude_payment_types: data.Product.exclude_payment_types,
    fulfillment_extras: data.fufillment_extras,
    live_mode: data.live_mode
  }
  return line
}
/**
 *
 */
Cart.prototype.addLine = function(item, qty, properties, shop, options = {}) {
  // The quantity available of this variant
  let lineQtyAvailable = -1
  let line
  // Check if Product is Available
  return item.checkAvailability(qty, {
    shop: options.shop || null,
    transaction: options.transaction || null
  })
    .then(availability => {
      if (!availability.allowed) {
        throw new Error(`${availability.title} is not available in this quantity, please try a lower quantity`)
      }
      if (availability.shop) {
        item.shop_id = availability.shop.id
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
      // If already in cart
      if (itemIndex > -1) {
        this.app.log.silly('Cart.addLine NEW QTY', lineItems[itemIndex])
        const maxQuantity = lineItems[itemIndex].max_quantity || -1
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
      // If new item
      else {
        const maxQuantity = item.max_quantity || -1
        let calculatedQty = qty

        if (maxQuantity > -1 && calculatedQty > maxQuantity) {
          calculatedQty = maxQuantity
        }

        if (lineQtyAvailable > -1 && calculatedQty > lineQtyAvailable) {
          calculatedQty = Math.max(0, lineQtyAvailable - calculatedQty)
        }
        // Item Quantity in cart
        item.quantity = calculatedQty
        // The max that will be fulfilled
        item.fulfillable_quantity = calculatedQty
        // The max allowed to be purchased
        item.max_quantity = maxQuantity
        // The properties of the item
        item.properties = properties
        // Set line
        line = this.line(item)
        line = this.setLineProperties(line)

        // Add line to line items
        lineItems.push(line)
        // Assign line items
        this.line_items = lineItems
      }
      return this
    })
}

/**
 *
 */
Cart.prototype.removeLine = function(item, qty, options = {}) {
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
Cart.prototype.addShipping = function(shipping = [], options: {[key: string]: any} = {}) {
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
  // this.setShippingLines(shippingLines)
  return this.save({transaction: options.transaction || null})
}

/**
 *
 */
Cart.prototype.removeShipping = function(shipping = [], options: {[key: string]: any} = {}) {
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
  // this.setShippingLines(shippingLines)
  return this.save({transaction: options.transaction || null})
}

/**
 *
 */
Cart.prototype.addTaxes = function(taxes = [], options = {}) {

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
}
/**
 *
 */
Cart.prototype.removeTaxes = function(taxes = [], options = {}) {
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
}
/**
 *
 */
Cart.prototype.close = function(status, save) {
  this.status = status || CART_STATUS.CLOSED
  if (save) {
    return this.save(save)
  }
  return this // Promise.resolve(this)
}
/**
 *
 */
Cart.prototype.draft = function (status, save) {
  this.status = status || CART_STATUS.DRAFT
  if (save) {
    return this.save(save)
  }
  return this // Promise.resolve(this)
}

Cart.prototype.clear = function () {
  this.line_items = []
  return this
}
/**
 *
 */
Cart.prototype.ordered = function(order, save) {
  this.order_id = order.id
  this.status = CART_STATUS.ORDERED
  if (save) {
    return this.save(save)
  }

  return this // Promise.resolve(this)
}
/**
 *
 */
Cart.prototype.buildOrder = function(options: {[key: string]: any} = {}) {
  return {
    // Request info
    client_details: options.client_details || this.client_details || {},
    ip: options.ip || null,
    payment_details: options.payment_details,
    payment_kind: options.payment_kind || this.app.config.get('cart.orders.payment_kind'),
    transaction_kind: options.transaction_kind || this.app.config.get('cart.orders.transaction_kind'),
    fulfillment_kind: options.fulfillment_kind || this.app.config.get('cart.orders.fulfillment_kind'),
    processing_method: options.processing_method || PAYMENT_PROCESSING_METHOD.CHECKOUT,
    shipping_address: options.shipping_address || this.shipping_address,
    billing_address: options.billing_address || this.billing_address,
    email: options.email || null,

    // Customer Info
    customer_id: options.customer_id || this.customer_id || null,

    // User ID
    user_id: options.user_id || this.user_id || null,

    // Cart Info
    cart_token: this.token,
    currency: this.currency,
    line_items: this.line_items || [],
    tax_lines: this.tax_lines || [],
    shipping_lines: this.shipping_lines || [],
    discounted_lines: this.discounted_lines || [],
    coupon_lines: this.coupon_lines || [],
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
    has_taxes: this.has_taxes,
    has_subscription: this.has_subscription,
    notes: this.notes,

    // Pricing Overrides
    pricing_override_id: this.pricing_override_id,
    pricing_overrides: this.pricing_overrides,
    total_overrides: this.total_overrides
  }
}
/**
 *
 */
Cart.prototype.calculatePricingOverrides = function(options: {[key: string]: any} = {}) {

  this.line_items = this.line_items || []
  this.pricing_overrides = this.pricing_overrides || []

  let pricingOverrides = []
  let deduction = 0

  if (!this.customer_id) {
    return Promise.resolve(this)
  }

  return Promise.resolve()
    .then(() => {
      if (this.Customer) {
        return this.Customer
      }
      else {
        return this.app.models['Customer'].findById(this.customer_id, {
          attributes: ['id', 'account_balance'],
          transaction: options.transaction || null
        })
      }
    })
    .then(_customer => {
      if (!_customer) {
        return
      }

      const exclusions = this.line_items.filter(item => {
        item.exclude_payment_types = item.exclude_payment_types || []
        return item.exclude_payment_types.indexOf('Account Balance') !== -1
      })

      pricingOverrides = this.pricing_overrides.filter(override => override)

      const accountBalanceIndex = pricingOverrides.findIndex(p => p.name === 'Account Balance')

      if (_customer.account_balance > 0) {
        // Apply Customer Account balance
        const removeTotal = sumBy(exclusions, (e: {[key: string]: any}) => e.calculated_price)
        const deductibleTotal = Math.max(0, this.total_due - removeTotal)
        deduction = Math.min(deductibleTotal, (deductibleTotal - (deductibleTotal - _customer.account_balance)))
        if (deduction > 0) {

          // If account balance has not been applied
          if (accountBalanceIndex === -1) {
            pricingOverrides.push({
              name: 'Account Balance',
              price: deduction
            })
          }
          else {
            pricingOverrides[accountBalanceIndex].price = deduction
          }
        }
      }
      else {
        if (accountBalanceIndex > -1) {
          pricingOverrides.splice(accountBalanceIndex, 1)
        }
      }
      return this.setPricingOverrides(pricingOverrides)
    })
    .catch(err => {
      this.app.log.error(err)
      return this
    })
},

/**
 *
 */
Cart.prototype.calculateDiscounts = function(options: {[key: string]: any} = {}) {

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
Cart.prototype.calculateShipping = function(options: {[key: string]: any} = {}) {
  if (!this.has_shipping) {
    return Promise.resolve(this)
  }
  return this.app.services.ShippingService.calculate(
    this,
    this.line_items,
    this.shipping_address,
    this.app.models['Cart'],
    options
  )
    .then(shippingResult => {
      this.setItemsShippingLines(shippingResult.line_items)

      return this
    })
    .catch(err => {
      this.app.log.error(err)
      return this
    })
}
/**
 *
 */
Cart.prototype.calculateTaxes = function(options: {[key: string]: any} = {}) {
  if (!this.has_taxes) {
    return Promise.resolve(this)
  }
  return this.app.services.TaxService.calculate(
    this,
    this.line_items,
    this.shipping_address,
    this.app.models['Cart'],
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
}
/**
 *
 */
Cart.prototype.recalculate = function(options: {[key: string]: any} = {}) {
  // Default Values
  // const collections = []

  this.resetDefaults()
  this.setLineItems(this.line_items)
  return Promise.resolve()
    .then(() => {
      return this.calculateDiscounts({transaction: options.transaction || null})
    })
    // .then(discounts => {
    //   // Calculate Coupons
    //   return app.services.CouponService.calculate(this, collections, app.models['Cart'])
    // })
    .then(() => {
      return this.calculateShipping({transaction: options.transaction || null})
    })
    .then(() => {
      return this.calculateTaxes({transaction: options.transaction || null})
    })
    .then(() => {
      // Calculate Customer Balance
      return this.calculatePricingOverrides({transaction: options.transaction || null})
    })
    .then(() => {
      return this.setTotals()
    })
    .catch(err => {
      this.app.log.error(err)
      return this
    })
}

/**
 *
 */
Cart.prototype.resolveCustomer = function(options: {[key: string]: any} = {}) {
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
        if (_customer) {
          _customer = _customer || null
          this.Customer = _customer
          this.setDataValue('Customer', _customer)
          this.set('Customer', _customer)
        }
        return this
      })
  }
}

// TODO
Cart.prototype.resolveCustomerAndItemCollections = function(options = {}) {
  this.line_items.forEach(item => {
    //
  })
}

/**
 *
 */
Cart.prototype.resolveDiscounts = function(options: {[key: string]: any} = {}) {
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

Cart.prototype.getCollectionPairs = function(options: {[key: string]: any} = {}) {
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

Cart.prototype.resolveShippingAddress = function(options: {[key: string]: any} = {}) {
  if (
    this.shipping_address
    && this.shipping_address instanceof this.app.models['Address'].instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  // Some carts may not have a shipping address Id
  else if (!this.shipping_address_id) {
    this.shipping_address = this.app.models['Address'].build({})
    return Promise.resolve(this)
  }
  else {
    return this.getShipping_address({transaction: options.transaction || null})
      .then(address => {
        address = address || null
        this.shipping_address = address
        this.setDataValue('shipping_address', address)
        this.set('shipping_address', address)
        return this
      })
  }
}

/**
 *
 */
Cart.prototype.resolveBillingAddress = function(options: {[key: string]: any} = {}) {
  if (
    this.billing_address
    && this.billing_address instanceof this.app.models['Address'].instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  // Some carts may not have a billing address Id
  else if (!this.billing_address_id) {
    this.billing_address = this.app.models['Address'].build({})
    return Promise.resolve(this)
  }
  else {
    return this.getBilling_address({transaction: options.transaction || null})
      .then(address => {
        address = address || null
        this.billing_address = address
        this.setDataValue('billing_address', address)
        this.set('billing_address', address)
        return this
      })
  }
}

/**
 *
 */
Cart.prototype.updateShippingAddress = function(address, options: {[key: string]: any} = {}) {
  const Address = this.app.models['Address']
  const shippingUpdate = Address.cleanAddress(address)

  return this.resolveShippingAddress({transaction: options.transaction || null})
    .then(() => {
      // If this address has an ID, then we should try and update it
      if (address.id || address.token) {
        return Address.resolve(address, {transaction: options.transaction || null})
          .then(_address => {
            return _address.update(shippingUpdate, {transaction: options.transaction || null})
          })
      }
      else {

        return this.shipping_address
          .merge(shippingUpdate)
          .save({transaction: options.transaction || null})
      }
    })
    .then(shippingAddress => {
      this.shipping_address = shippingAddress
      this.setDataValue('shipping_address', shippingAddress)
      this.set('shipping_address', shippingAddress)
      if (this.shipping_address_id !== shippingAddress.id) {
        return this.setShipping_address(shippingAddress.id, {transaction: options.transaction || null})
      }
      return this
    })
}

/**
 *
 */
Cart.prototype.updateBillingAddress = function(address, options: {[key: string]: any} = {}) {
  const Address = this.app.models['Address']
  const billingUpdate = Address.cleanAddress(address)

  return this.resolveBillingAddress({transaction: options.transaction || null})
    .then(() => {
      // If this address has an ID, then we should try and update it
      if (address.id || address.token) {
        return Address.resolve(address, {transaction: options.transaction || null})
          .then(_address => {
            return _address.update(billingUpdate, {transaction: options.transaction || null})
          })
      }
      else {
        return this.billing_address
          .merge(billingUpdate)
          .save({transaction: options.transaction || null})
      }
    })
    .then(billingAddress => {
      this.billing_address = billingAddress
      this.setDataValue('billing_address', billingAddress)
      this.set('billing_address', billingAddress)
      if (this.billing_address_id !== billingAddress.id) {
        return this.setBilling_address(billingAddress.id, {transaction: options.transaction || null})
      }
      return this
    })
}
