import { FabrixApp } from '@fabrix/fabrix'
import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { isObject, isString, isNumber, values, merge } from 'lodash'

import { Product as ProductQuery } from '../utils/queryDefaults'
import { UNITS } from '../../enums'
import { PRODUCT_DEFAULTS } from '../../enums'
import { DISCOUNT_STATUS } from '../../enums'

export class ProductResolver extends SequelizeResolver {
  /**
   *
   * @param criteria
   * @param options
   * @returns {Promise.<TResult>}
   */
  findByIdDefault (criteria, options: {[key: string]: any} = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      ProductQuery.default(this.app),
      options
    )
    let resProduct
    return this.findById(criteria, options)
      .then(product => {
        resProduct = product

        //   if (resProduct) {
        //     return resProduct.resolveReqCollections(options)
        //   }
        //   else {
        //     return
        //   }
        // })
        // .then(() => {
        if (resProduct && options.req && options.req.customer) {
          return resProduct.getCustomerHistory(
            options.req.customer,
            { transaction: options.transaction || null}
          )
        }
        else {
          return
        }
      })
      .then(() => {
        if (resProduct) {
          return resProduct.calculate({
            req: options.req || null,
            transaction: options.transaction || null
          })
        }
        else {
          return resProduct
        }
      })
  }
  /**
   *
   */
  findByHandleDefault (handle, options: {[key: string]: any} = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      ProductQuery.default(this.app),
      options,
      {
        where: {
          handle: handle
        }
      }
    )
    let resProduct
    return this.findOne(options)
      .then(product => {
        resProduct = product

        //   if (resProduct) {
        //     return resProduct.resolveReqCollections(options)
        //   }
        //   else {
        //     return
        //   }
        // })
        // .then(() => {
        if (resProduct && options.req && options.req.customer) {
          return resProduct.getCustomerHistory(
            options.req.customer,
            { transaction: options.transaction || null}
          )
        }
        else {
          return
        }
      })
      .then(() => {
        if (resProduct) {
          return resProduct.calculate({
            req: options.req || null,
            transaction: options.transaction || null
          })
        }
        else {
          return resProduct
        }
      })
  }
  /**
   *
   */
  findOneDefault(options: {[key: string]: any} = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      ProductQuery.default(this.app),
      options
    )
    let resProduct
    return this.findOne(options)
      .then(product => {
        if (!product) {
          // resProduct = app.models['Product'].build()
          // throw new ModelError('E_NOT_FOUND', `${criteria} not found`))
        }
        resProduct = product

        //   if (resProduct) {
        //     return resProduct.resolveReqCollections(options)
        //   }
        //   else {
        //     return
        //   }
        // })
        // .then(() => {
        if (resProduct && options.req && options.req.customer) {
          return resProduct.getCustomerHistory(
            options.req.customer,
            { transaction: options.transaction || null}
          )
        }
        else {
          return
        }
      })
      .then(() => {
        if (resProduct) {
          return resProduct.calculate({
            req: options.req || null,
            transaction: options.transaction || null
          })
        }
        else {
          return resProduct
        }
      })
  }
  /**
   *
   * @param options
   * @returns {*|Promise.<Array.<Instance>>}
   */
  findAllDefault(options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      ProductQuery.findAllDefault(this.app),
      options
    )
    return this.findAll(options)
  }
  /**
   *
   * @param options
   * @returns {Promise.<Object>}
   */
  findAndCountDefault (options) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      ProductQuery.findAllDefault(this.app),
      options
    )
    return this.findAndCountAll(options)
  }
  /**
   * Resolve by instance Function
   * @param product
   * @param options
   */
  resolveByInstance (product, options: {[key: string]: any} = {}) {
    return Promise.resolve(product)
  }
  /**
   * Resolve by id Function
   * @param product
   * @param options
   */
  resolveById (product, options: {[key: string]: any} = {}) {
    return this.findById(product.id, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `product ${product.id} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by token Function
   * @param product
   * @param options
   */
  resolveByToken (product, options: {[key: string]: any} = {}) {
    return this.findOne(this.app.services.SequelizeService.mergeOptionDefaults(options, {
      where: {
        token: product.token
      }
    }))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `product token ${product.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by handle Function
   * @param product
   * @param options
   */
  resolveByhandle (product, options: {[key: string]: any} = {}) {
    return this.findOne(this.app.services.SequelizeService.mergeOptionDefaults(options, {
      where: {
        handle: product.handle
      }
    }))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `product handle ${product.handle} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by number Function
   * @param product
   * @param options
   */
  resolveByNumber (product, options: {[key: string]: any} = {}) {
    return this.findById(product, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `product ${product.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by string Function
   * @param product
   * @param options
   */
  resolveByString (product, options: {[key: string]: any} = {}) {
    return this.findOne(this.app.services.SequelizeService.mergeOptionDefaults(options, {
      where: {
        handle: product
      }
    }))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `product ${product} not found`)
        }
        return resUser
      })
  }
  /**
   * Primary Resolve Function
   * @param product
   * @param options
   */
  resolve(product, options: {[key: string]: any} = {}) {
    const resolvers = {
      'instance': product instanceof this.instance,
      'id': !!(product && isObject(product) && product.id),
      'handle': !!(product && isObject(product) && product.token),
      'number': !!(product && isNumber(product)),
      'string': !!(product && isString(product))
    }
    const type = Object.keys(resolvers).find((key) => resolvers[key])

    switch (type) {
      case 'instance': {
        return this.resolveByInstance(product, options)
      }
      case 'id': {
        return this.resolveById(product, options)
      }
      case 'handle': {
        return this.resolveByToken(product, options)
      }
      case 'number': {
        return this.resolveByNumber(product, options)
      }
      case 'string': {
        return this.resolveByString(product, options)
      }
      default: {
        // TODO create proper error
        const err = new Error(`Unable to resolve product ${product}`)
        return Promise.reject(err)
      }
    }
  }
}

/**
 * @module Product
 * @description Product Model
 */
export class Product extends Model {

  static get resolver() {
    return ProductResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        enums: {
          /**
           * Expose UNITS enums
           */
          UNITS: UNITS,
          PRODUCT_DEFAULTS: PRODUCT_DEFAULTS,
        },
        underscored: true,
        // paranoid: !app.config.cart.allow.destroy_product,
        // defaultScope: {
        //   where: {
        //     live_mode: app.config.get('cart.live_mode')
        //   }
        //   // paranoid: false
        // },
        scopes: {
          live: {
            where: {
              live_mode: true
            }
          },
          published: {
            where: {
              published: true
            }
          }
        },
        hooks: {
          beforeValidate: [
            (product, options) => {
              if (!product.handle && product.title) {
                product.handle = product.title
              }
              if (!product.calculated_price && product.price) {
                product.calculated_price = product.price
              }
              if (!product.compare_at_price && product.price) {
                product.compare_at_price = product.price
              }
            }
          ],
          beforeCreate: [
            (product, options) => {
              return app.services.ProductService.beforeCreate(product, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          beforeUpdate: [
            (product, options) => {
              return app.services.ProductService.beforeUpdate(product, options)
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
      // TODO Multi-Site Support. Change to domain?
      host: {
        type: Sequelize.STRING,
        defaultValue: PRODUCT_DEFAULTS.HOST
      },
      // Unique Name for the product
      handle: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        set: function(val) {
          this.setDataValue('handle', app.services.ProxyCartService.handle(val))
        }
      },
      // Product Title
      title: {
        type: Sequelize.STRING,
        set: function(val) {
          this.setDataValue('title', app.services.ProxyCartService.title(val))
        }
      },
      // The body of a product (in markdown or html)
      body: {
        type: Sequelize.TEXT
      },
      // The html of a product (DO NOT EDIT DIRECTLY)
      html: {
        type: Sequelize.TEXT
      },
      // SEO title
      seo_title: {
        type: Sequelize.STRING,
        set: function(val) {
          this.setDataValue('seo_title', app.services.ProxyCartService.title(val))
        }
      },
      // SEO description
      seo_description: {
        type: Sequelize.TEXT,
        set: function(val) {
          this.setDataValue('seo_description', app.services.ProxyCartService.description(val))
        }
      },
      // Type of the product e.g. 'Snow Board'
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        set: function(val) {
          this.setDataValue('type', app.services.ProxyCartService.title(val))
        }
      },
      // The tax code of the product, defaults to physical good.
      tax_code: {
        type: Sequelize.STRING,
        defaultValue: PRODUCT_DEFAULTS.TAX_CODE // Physical Good
      },
      // Pricing Average against competitors
      compare_at_price: {
        type: Sequelize.INTEGER,
        defaultValue: PRODUCT_DEFAULTS.PRICE
      },
      // Default price of the product in cents
      price: {
        type: Sequelize.INTEGER,
        defaultValue: PRODUCT_DEFAULTS.PRICE
      },
      // Pricing after
      calculated_price: {
        type: Sequelize.INTEGER,
        defaultValue: PRODUCT_DEFAULTS.CALCULATED_PRICE
      },
      // Default currency of the product
      currency: {
        type: Sequelize.STRING,
        defaultValue: PRODUCT_DEFAULTS.CURRENCY
      },
      // The total count of orders created with this product
      total_orders: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Discounts applied
      discounted_lines: {
        type: Sequelize.JSONB,
        defaultValue: PRODUCT_DEFAULTS.DISCOUNTED_LINES
      },
      //   helpers.JSONB('Product', app, Sequelize, 'discounted_lines', {
      //   defaultValue: PRODUCT_DEFAULTS.DISCOUNTED_LINES
      // }),
      // Total value of discounts
      total_discounts: {
        type: Sequelize.INTEGER,
        defaultValue: PRODUCT_DEFAULTS.TOTAL_DISCOUNTS
      },
      // The sales channels in which the product is visible.
      published_scope: {
        type: Sequelize.STRING,
        defaultValue: PRODUCT_DEFAULTS.PUBLISHED_SCOPE
      },
      // Is product published
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue: PRODUCT_DEFAULTS.PUBLISHED
      },
      // Date/Time the Product was published
      published_at: {
        type: Sequelize.DATE
      },
      // Date/Time the Product was unpublished
      unpublished_at: {
        type: Sequelize.DATE
      },
      // If product is available and has not been discontinued
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: PRODUCT_DEFAULTS.AVAILABLE
      },
      // Options for the product (size, color, etc.)
      options: {
        type: Sequelize.JSONB,
        defaultValue: PRODUCT_DEFAULTS.OPTIONS
      },
      //   helpers.JSONB('Product', app, Sequelize, 'options', {
      //   defaultValue: PRODUCT_DEFAULTS.OPTIONS
      // }),

      // Property Based Pricing
      property_pricing: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('Product', app, Sequelize, 'property_pricing', {
      //   defaultValue: {}
      // }),

      // Weight of the product, defaults to grams
      weight: {
        type: Sequelize.INTEGER,
        defaultValue: PRODUCT_DEFAULTS.WEIGHT
      },
      // Unit of Measurement for Weight of the product, defaults to grams
      weight_unit: {
        type: Sequelize.ENUM,
        values: values(UNITS),
        defaultValue: PRODUCT_DEFAULTS.WEIGHT_UNIT
      },
      // The Average Score of Reviews
      review_score: {
        type: Sequelize.INTEGER,
        defaultValue: PRODUCT_DEFAULTS.REVIEWS_SCORE
      },
      // The Total Reviews of the Product
      total_reviews: {
        type: Sequelize.INTEGER,
        defaultValue: PRODUCT_DEFAULTS.TOTAL_REVIEWS
      },

      // The Total variants count
      total_variants: {
        type: Sequelize.INTEGER,
        defaultValue: PRODUCT_DEFAULTS.TOTAL_VARIANTS
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
      //   helpers.JSONB('Product', app, Sequelize, 'exclude_payment_types', {
      //   defaultValue: []
      // }),
      // Google Specific Listings
      google: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('Product', app, Sequelize, 'google', {
      //   defaultValue: {
      //     // // 'Google Shopping / Google Product Category'
      //     // g_product_category: null,
      //     // // 'Google Shopping / Gender'
      //     // g_gender: null,
      //     // // 'Google Shopping / Age Group'
      //     // g_age_group: null,
      //     // // 'Google Shopping / MPN'
      //     // g_mpn: null,
      //     // // 'Google Shopping / Adwords Grouping'
      //     // g_adwords_grouping: null,
      //     // // 'Google Shopping / Adwords Labels'
      //     // g_adwords_label: null,
      //     // // 'Google Shopping / Condition'
      //     // g_condition: null,
      //     // // 'Google Shopping / Custom Product'
      //     // g_custom_product: null,
      //     // // 'Google Shopping / Custom Label 0'
      //     // g_custom_label_0: null,
      //     // // 'Google Shopping / Custom Label 1'
      //     // g_custom_label_1: null,
      //     // // 'Google Shopping / Custom Label 2'
      //     // g_custom_label_2: null,
      //     // // 'Google Shopping / Custom Label 3'
      //     // g_custom_label_3: null,
      //     // // 'Google Shopping / Custom Label 4'
      //     // g_custom_label_4: null
      //   }
      // }),
      // Amazon Specific listings
      amazon: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('Product', app, Sequelize, 'amazon', {
      //   defaultValue: {}
      // }),

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
  public static associate (models) {
    // models.Product.belongsToMany(models.Shop, {
    //   as: 'shops',
    //   through: 'ShopProduct'
    // })
    models.Product.hasMany(models.ProductImage, {
      as: 'images',
      foreignKey: 'product_id',
      through: null,
      onDelete: 'CASCADE'
    })
    // models.Product.belongsToMany(models.Image, {
    //   as: 'images',
    //   through: {
    //     model: models.ItemImage,
    //     unique: false,
    //     scope: {
    //       model: 'product'
    //     }
    //   },
    //   foreignKey: 'model_id',
    //   constraints: false
    // })
    models.Product.hasMany(models.ProductVariant, {
      as: 'variants',
      foreignKey: 'product_id',
      // through: null,
      onDelete: 'CASCADE'
    })
    models.Product.hasMany(models.ProductReview, {
      as: 'reviews',
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    })
    // models.Product.belongsToMany(models.Cart, {
    //   as: 'carts',
    //   through: 'CartProduct'
    // })
    models.Product.belongsToMany(models.Collection, {
      as: 'collections',
      through: {
        model: models.ItemCollection,
        unique: false,
        scope: {
          model: 'product'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })

    models.Product.hasOne(models.Metadata, {
      as: 'metadata',
      // scope: {
      //   model: 'product'
      // },
      foreignKey: 'product_id'
      // constraints: false
    })

    models.Product.belongsToMany(models.Vendor, {
      as: 'vendors',
      through: {
        model: models.VendorProduct,
        unique: false,
      },
      foreignKey: 'product_id',
      // constraints: false
    })
    models.Product.belongsToMany(models.Shop, {
      as: 'shops',
      through: {
        model: models.ShopProduct,
        unique: false,
      },
      foreignKey: 'product_id',
      // constraints: false
    })
    models.Product.belongsToMany(models.Tag, {
      as: 'tags',
      through: {
        model: models.ItemTag,
        unique: false,
        scope: {
          model: 'product'
        }
      },
      foreignKey: 'model_id',
      otherKey: 'tag_id',
      constraints: false
    })
    // models.Product.belongsToMany(models.Collection, {
    //   as: 'collections',
    //   through: {
    //     model: models.ItemCollection,
    //     unique: false,
    //     scope: {
    //       model: 'product'
    //     }
    //   },
    //   foreignKey: 'model_id',
    //   otherKey: 'collection_id',
    //   constraints: false
    // })
    models.Product.belongsToMany(models.Product, {
      as: 'associations',
      through: {
        model: models.ProductAssociation,
        unique: false
      },
      foreignKey: 'product_id',
      otherKey: 'associated_product_id',
      // constraints: false
    })
    models.Product.belongsToMany(models.Product, {
      as: 'relations',
      through: {
        model: models.ProductAssociation,
        unique: false
      },
      foreignKey: 'associated_product_id',
      otherKey: 'product_id',
      // constraints: false
    })
    models.Product.belongsToMany(models.Discount, {
      as: 'discounts',
      through: {
        model: models.ItemDiscount,
        unique: false,
        scope: {
          model: 'product'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })
    models.Product.belongsToMany(models.Event, {
      as: 'event_items',
      through: {
        model: models.EventItem,
        unique: false,
        scope: {
          object: 'product'
        }
      },
      foreignKey: 'object_id',
      constraints: false
    })
  }
}

export interface Product {
  setItemDiscountedLines(discounts, criteria, options): any
  setDiscountedLines(lines): any
  setCalculatedPrice(calculatedPrice): any
  setTotals(): any
  getCustomerHistory(customer, options): any
  hasPurchaseHistory(customerId, options): any
  isSubscribed(customerId, options): any
  getCollectionPairs(options): any
  calculateDiscounts(options): any
  calculate(options): any
  mergeIntoCollections(colsB): any
  toJSON(): any
  resolveVariants(options): any
  getDefaultVariant(options): any
  resolveAssociations(options): any
  resolveImages(options): any
  resolveVendors(options): any
  resolveMetadata(options): any
  resolveShops(options): any
  resolveTags(options): any
  resolveCollections(options): any
  resolveCoupons(options): any
  resolveDiscounts(options): any

}
/**
 *
 */
Product.prototype.setItemDiscountedLines = function (discounts = [], criteria = [], options: {[key: string]: any} = {}) {

  // Set this to the default
  this.discounted_lines = []

  // Holds the final factored results
  const factoredDiscountedLines = []
  // Holds list of all discount objects being tried
  let discountsArr = []

  // This handles one time and threshold discounts for items already in cart.
  if (options.req && options.req.cart) {
    options.req.cart.line_items = options.req.cart.line_items || []
    options.req.cart.line_items.map(item => {
      // For each item run the normal discounts
      discounts.forEach(discount => {
        item = discount.discountItem(item, criteria)
      })
      return item
    })
    options.req.cart.line_items.forEach(item => {
      item.discounted_lines = item.discounted_lines || []
      discountsArr = [...discountsArr, item.discounted_lines.map(line => line.id)]
    })
  }

  // For each item run the normal discounts
  discounts.forEach(discount => {
    discount.discountItem(this, criteria)
  })

  // Gather all discounts into a single array
  this.discounted_lines.forEach(line => {
    discountsArr = [...discountsArr, line.id]
  })

  this.discounted_lines = this.discounted_lines.map(discount => {
    discount.rules = discount.rules || {}
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
      && options.req
      && options.req.cart
      && (options.req.cart.total_price + this.price) < discount.minimum_order_amount
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

  this.discounted_lines.forEach(discountedLine => {
    if (discountedLine.applies === true) {
      // New calculated price
      const calculatedPrice = Math.max(0, this.calculated_price - discountedLine.price)
      // New Total Deducted
      const totalDeducted = Math.min(this.calculated_price, (this.calculated_price - (this.calculated_price - discountedLine.price)))
      // Set calculated price
      this.calculated_price = calculatedPrice
      // Set total Discounts
      this.total_discounts = Math.min(this.price, this.total_discounts + totalDeducted)

      const fI = factoredDiscountedLines.findIndex(d => d.id === discountedLine.id)
      if (fI > -1) {
        factoredDiscountedLines[fI].price = factoredDiscountedLines[fI].price + totalDeducted
      }
      else {
        discountedLine.price = totalDeducted
        factoredDiscountedLines.push(discountedLine)
      }
    }
  })

  return this.setDiscountedLines(factoredDiscountedLines)
}
/**
 *
 */
Product.prototype.setDiscountedLines = function(lines) {
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
Product.prototype.setCalculatedPrice = function(calculatedPrice) {
  this.calculated_price = calculatedPrice
  return this
}

/**
 *
 */
Product.prototype.setTotals = function() {
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
Product.prototype.getCustomerHistory = function(customer, options: {[key: string]: any} = {}) {
  let hasPurchaseHistory = false, isSubscribed = false

  return this.hasPurchaseHistory(customer.id, options)
    .then(pHistory => {
      hasPurchaseHistory = pHistory
      return this.isSubscribed(customer.id, options)
    })
    .then(pHistory => {
      isSubscribed = pHistory
      this.setDataValue('has_purchase_history', hasPurchaseHistory)
      this.setDataValue('is_subscribed', isSubscribed)
      return this
    })
    .catch(err => {
      this.setDataValue('has_purchase_history', hasPurchaseHistory)
      this.setDataValue('is_subscribed', isSubscribed)
      return this
    })
}
/**
 *
 */
Product.prototype.hasPurchaseHistory = function(customerId, options: {[key: string]: any} = {}) {

  return this.app.models['OrderItem'].findOne({
    where: {
      customer_id: customerId,
      product_id: this.id,
      fulfillment_status: {
        $not: ['cancelled', 'pending', 'none']
      }
    },
    attributes: ['id'],
    transaction: options.transaction || null
  })
    .then(pHistory => {
      if (pHistory) {
        return true
      }
      else {
        return false
      }
    })
    .catch(err => {
      return false
    })
}

/**
 *
 */
Product.prototype.isSubscribed = function(customerId, options: {[key: string]: any} = {}) {
  return this.app.models['Subscription'].findOne({
    where: {
      customer_id: customerId,
      active: true,
      line_items: {
        $contains: [{
          product_id: this.id
        }]
      }
    },
    attributes: ['id'],
    transaction: options.transaction || null
  })
    .then(pHistory => {
      if (pHistory) {
        return true
      }
      else {
        return false
      }
    })
    .catch(err => {
      return false
    })
}

/**
 *
 */
Product.prototype.getCollectionPairs = function(options: {[key: string]: any} = {}) {
  const collectionPairs = []
  const criteria = []

  return Promise.resolve()
    .then(() => {
      if (options.req && options.req.customer && options.req.customer.id) {
        criteria.push({
          model: 'customer',
          model_id: options.req.customer.id
        })
      }
      // if (options.req && options.req.cart && options.req.cart.id) {
      //   criteria.push({
      //     model: 'cart',
      //     model_id: options.req.cart.id
      //   })
      // }
      if (this.id) {
        criteria.push({
          model: 'product',
          model_id: this.id
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
Product.prototype.calculateDiscounts = function(options: {[key: string]: any} = {}) {
  const criteria = []
  let collectionPairs = [], discountCriteria = [], checkHistory = []
  // const discountedLines = this.discounted_lines || []

  let resDiscounts
  return Promise.resolve()
    .then(() => {
      return this.getCollectionPairs({
        req: options.req || null,
        transaction: options.transaction || null
      })
    })
    .then(_collections => {
      collectionPairs = _collections
      if (options.req && options.req.cart && options.req.cart.id) {
        criteria.push({
          model: 'cart',
          model_id: options.req.cart.id
        })
      }
      if (options.req && options.req.customer && options.req.customer.id) {
        criteria.push({
          model: 'customer',
          model_id: options.req.customer.id
        })
      }
      if (this.id) {
        criteria.push({
          model: 'product',
          model_id: this.id
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
        if (
          discount.applies_once_per_customer
          && options.req
          && options.req.customer
          && options.req.customer.id
        ) {
          checkHistory.push(discount)
        }
      })

      if (checkHistory.length > 0) {
        return Promise.all(checkHistory.map(discount => {
          return discount.eligibleCustomer(options.req.customer.id, {
            transaction: options.transaction || null
          })
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

      return this.setItemDiscountedLines(resDiscounts, discountCriteria, options)
    })
    .catch(err => {
      this.app.log.error(err)
      return this
    })
}

/**
 *
 */
Product.prototype.calculate = function (options: {[key: string]: any} = {}) {
  if (!this) {
    return
  }
  // Set defaults
  this.calculated_price = this.price

  // Modify defaults
  // app.services.DiscountService.calculateCollections(
  //   this,
  //   this.collections,
  //   app.models['Product'],
  //   {transaction: options.transaction || null}
  // )

  // obj, collections, resolver, options
  return this.calculateDiscounts(options)
    .then(() => {
      return this
    })
}
/**
 *
 */
Product.prototype.mergeIntoCollections = function(colsB = []) {
  const collections = this.collections

  colsB.forEach(collection => {
    if (!this.collections.some(colA => colA.id === collection.id)) {
      collections.push(collection)
    }
  })

  this.collections = collections
  this.setDataValue('collections', collections)
  this.set('collections', collections)

  return this
}
/**
 * TODO, this should likely be done with a view
 * Format return data
 * Converts tags to array of strings
 * Converts any nested variant tags to array of strings
 * Returns only metadata data
 * Converts vendors to array of strings
 */
Product.prototype.toJSON = function() {
  const position = this.position
  // Make JSON
  const resp = this instanceof this.app.models['Product'].instance ? this.get({ plain: true }) : this
  // Set Defaults
  // resp.calculated_price = resp.price

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
  // Map Variants as Products are mapped
  if (resp.variants) {
    resp.variants.map((variant, idx) => {
      if (variant.tags) {
        resp.variants[idx].tags = variant.tags.map(tag => {
          if (tag && isString(tag)) {
            return tag
          }
          else if (tag && tag.name) {
            return tag.name
          }
        })
      }
      if (variant.metadata) {
        if (typeof variant.metadata.data !== 'undefined') {
          resp.variants[idx].metadata = variant.metadata.data
        }
      }
      // Set Defaults
      resp.variants[idx].calculated_price = variant.price
      // TODO loop through collections and produce calculated price

    })
  }
  // Transform Metadata to plain on toJSON
  if (resp.metadata) {
    if (typeof resp.metadata.data !== 'undefined') {
      resp.metadata = resp.metadata.data
    }
  }
  // Transform Vendors to strings
  if (resp.vendors) {
    resp.vendors = resp.vendors.map(vendor => {
      if (vendor && isString(vendor)) {
        return vendor
      }
      else {
        return vendor.name
      }
    })
  }

  if (position) {
    resp.position = position
  }
  return resp
}
/**
 *
 */
Product.prototype.resolveVariants = function(options: {[key: string]: any} = {}) {
  if (
    this.variants
    && this.variants.every(v => v instanceof this.app.models['ProductVariant'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getVariants({
      limit: 500,
      transaction: options.transaction || null,
      order: [['position', 'ASC']]
    })
      .then(variants => {
        variants = variants || []
        this.variants = variants
        this.setDataValue('variants', variants)
        this.set('variants', variants)
        return this
      })
  }
}
/**
 *
 */
Product.prototype.getDefaultVariant = function(options: {[key: string]: any} = {}) {
  if (
    this.variants
    && this.variants.every(v => v instanceof this.app.models['ProductVariant'].instance)
    && this.variants.some(v => v.position === 1)
    && options.reload !== true
  ) {
    return Promise.resolve(this.variants.find(v => v.position === 1))
  }
  else {
    return this.getVariants({
      where: {
        position: 1
      },
      limit: 1,
      transaction: options.transaction || null
    })
      .then(variants => {
        const variant = variants[0] || null
        return variant
      })
  }
}
/**
 *
 */
Product.prototype.resolveAssociations = function(options: {[key: string]: any} = {}) {
  if (
    this.associations
    && this.associations.every(p => p instanceof this.app.models['Product'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getAssociations({
      limit: 100,
      transaction: options.transaction || null
    })
      .then(associations => {
        associations = associations || []
        this.associations = associations
        this.setDataValue('associations', associations)
        this.set('associations', associations)
        return this
      })
  }
}
/**
 *
 */
Product.prototype.resolveImages = function(options: {[key: string]: any} = {}) {
  if (
    this.images
    && this.images.every(i => i instanceof this.app.models['ProductImage'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getImages({
      limit: 50,
      transaction: options.transaction || null,
      order: [['position', 'ASC']]
    })
      .then(images => {
        images = images || []
        this.images = images
        this.setDataValue('images', images)
        this.set('images', images)
        return this
      })
  }
}

/**
 *
 */
Product.prototype.resolveVendors = function(options: {[key: string]: any} = {}) {
  if (
    this.vendors
    && this.vendors.every(v => v instanceof this.app.models['Vendor'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getVendors({
      limit: 50,
      transaction: options.transaction || null
    })
      .then(vendors => {
        vendors = vendors || []
        this.vendors = vendors
        this.setDataValue('vendors', vendors)
        this.set('vendors', vendors)
        return this
      })
  }
}
/**
 *
 */
Product.prototype.resolveVendors = function(options: {[key: string]: any} = {}) {
  if (
    this.vendors
    && this.vendors.every(v => v instanceof this.app.models['Vendor'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getVendors({
      limit: 50,
      transaction: options.transaction || null
    })
      .then(vendors => {
        vendors = vendors || []
        this.vendors = vendors
        this.setDataValue('vendors', vendors)
        this.set('vendors', vendors)
        return this
      })
  }
}
/**
 *
 */
Product.prototype.resolveMetadata = function(options: {[key: string]: any} = {}) {
  if (
    this.metadata
    && this.metadata instanceof this.app.models['Metadata'].instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getMetadata({transaction: options.transaction || null})
      .then(_metadata => {
        _metadata = _metadata || {product_id: this.id}
        this.metadata = _metadata
        this.setDataValue('metadata', _metadata)
        this.set('metadata', _metadata)
        return this
      })
  }
}

/**
 *
 */
Product.prototype.resolveShops = function(options: {[key: string]: any} = {}) {
  if (
    this.shops
    && this.shops.length > 0
    && this.shops.every(d => d instanceof this.app.models['Shop'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getShops({
      limit: 50,
      transaction: options.transaction || null
    })
      .then(shops => {
        shops = shops || []
        this.shops = shops
        this.setDataValue('shops', shops)
        this.set('shops', shops)
        return this
      })
  }
}
/**
 *
 */
Product.prototype.resolveTags = function(options: {[key: string]: any} = {}) {
  if (
    this.tags
    && this.tags.length > 0
    && this.tags.every(t => t instanceof this.app.models['Tag'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getTags({
      limit: 50,
      transaction: options.transaction || null
    })
      .then(tags => {
        tags = tags || []
        this.tags = tags
        this.setDataValue('tags', tags)
        this.set('tags', tags)
        return this
      })
  }
}
/**
 *
 */
// resolveReqCollections: function(options) {
//   options = options || {}
//
//   return Promise.resolve()
//     .then(() => {
//       return this.resolveCollections({transaction: options.transaction || null})
//     })
//     .then(() => {
//       if (options.req && options.req.customer) {
//         return options.req.customer.resolveCollections({transaction: options.transaction || null})
//       }
//       else {
//         return {collections: []}
//       }
//     })
//     .then(customer => {
//       return this.mergeIntoCollections(customer.collections)
//     })
// },
/**
 *
 */
Product.prototype.resolveCollections = function(options: {[key: string]: any} = {}) {
  if (
    this.collections
    && this.collections.length > 0
    && this.collections.every(c => c instanceof this.app.models['Collection'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getCollections({
      limit: 50,
      transaction: options.transaction || null
    })
      .then(collections => {
        collections = collections || []
        this.collections = collections
        this.setDataValue('collections', collections)
        this.set('collections', collections)
        return this
      })
  }
}
/**
 *
 */
Product.prototype.resolveCoupons = function(options: {[key: string]: any} = {}) {
  if (
    this.coupons
    && this.coupons.length > 0
    && this.coupons.every(c => c instanceof this.app.models['Coupon'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getCoupons({transaction: options.transaction || null})
      .then(coupons => {
        coupons = coupons || []
        this.coupons = coupons
        this.setDataValue('coupons', coupons)
        this.set('coupons', coupons)
        return this
      })
  }
}
/**
 *
 */
Product.prototype.resolveDiscounts = function (options: {[key: string]: any} = {}) {
  if (
    this.discounts
    && this.discounts.length > 0
    && this.discounts.every(d => d instanceof this.app.models['Discount'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getDiscounts({
      limit: 10,
      transaction: options.transaction || null
    })
      .then(_discounts => {
        _discounts = _discounts || []
        this.discounts = _discounts
        this.setDataValue('discounts', _discounts)
        this.set('discounts', _discounts)
        return this
      })
  }
}
