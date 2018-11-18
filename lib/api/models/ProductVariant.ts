import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { FabrixApp } from '@fabrix/fabrix'
import { values, isObject, isString, isNumber, defaultsDeep } from 'lodash'

import { ProductVariant as ProductVariantQuery } from '../utils/queryDefaults'
import { UNITS } from '../../enums'
import { INTERVALS } from '../../enums'
import { INVENTORY_POLICY } from '../../enums'
import { VARIANT_DEFAULTS } from '../../enums'

export class ProductVariantResolver extends SequelizeResolver {
  /**
   *
   * @param id
   * @param options
   * @returns {*|Promise.<Instance>}
   */
  findByIdDefault (id, options = {}) {
    options = defaultsDeep(options, ProductVariantQuery.default(this.app))
    return this.findById(id, options)
  }

  findAllDefault (options: {[key: string]: any} = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      ProductVariantQuery.default(this.app),
      options
    )
    return this.findAll(options)
  }

  resolve (variant, options: {[key: string]: any} = {}) {
    const Variant = this

    if (variant instanceof Variant.instance) {
      return Promise.resolve(variant)
    }
    else if (variant && isObject(variant) && variant.id) {
      return Variant.findById(variant.id, options)
        .then(resVariant => {
          if (!resVariant && options.reject !== false) {
            throw new ModelError('E_NOT_FOUND', `Variant ${variant.id} not found`)
          }
          return resVariant || variant
        })
    }
    else if (variant && isObject(variant) && variant.sku) {
      return Variant.findOne(defaultsDeep({
        where: {
          sku: variant.sku
        }
      }, options))
        .then(resVariant => {
          if (!resVariant && options.reject !== false) {
            throw new ModelError('E_NOT_FOUND', `Variant ${variant.sku} not found`)
          }
          return resVariant || variant
        })
    }
    else if (variant && isNumber(variant)) {
      return Variant.findById(variant, options)
        .then(resVariant => {
          if (!resVariant && options.reject !== false) {
            throw new ModelError('E_NOT_FOUND', `Variant ${variant} not found`)
          }
          return resVariant || variant
        })
    }
    else if (variant && isString(variant)) {
      return Variant.findOne(defaultsDeep({
        where: {
          sku: variant
        }
      }, options))
        .then(resVariant => {
          if (!resVariant && options.reject !== false) {
            throw new ModelError('E_NOT_FOUND', `Variant ${variant} not found`)
          }
          return resVariant || variant
        })
    }
    else {
      if (options.reject !== false) {
        // TODO create proper error
        const err = new Error(`Unable to resolve Variant ${variant}`)
        return Promise.reject(err)
      }
      else {
        return Promise.resolve(variant)
      }
    }
  }
}

/**
 * @module ProductVariant
 * @description Product Variant Model
 */
export class ProductVariant extends Model {

  static get resolver() {
    return ProductVariantResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          /**
           * Expose UNITS enums
           */
          UNITS: UNITS,
          /**
           * Expose INTERVALS enums
           */
          INTERVALS: INTERVALS,
          /**
           * Expose INVENTORY_POLICY enums
           */
          INVENTORY_POLICY: INVENTORY_POLICY,
          /**
           * Expose VARIANT_DEFAULTS
           */
          VARIANT_DEFAULTS: VARIANT_DEFAULTS,
        },
        // paranoid: !app.config.cart.allow.destroy_variant,
        // defaultScope: {
        //   where: {
        //     live_mode: app.config.get('cart.live_mode')
        //   },
        //   // paranoid: false,
        //   order: [['position', 'ASC']]
        // },
        scopes: {
          live: {
            where: {
              live_mode: true
            }
          }
        },
        hooks: {
          beforeValidate: [
            (productVariant, options) => {
              if (!productVariant.calculated_price && productVariant.price) {
                productVariant.calculated_price = productVariant.price
              }
            }
          ],
          beforeCreate: [
            (productVariant, options) => {
              return app.services.ProductService.beforeVariantCreate(productVariant, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          beforeUpdate: [
            (productVariant, options) => {
              return app.services.ProductService.beforeVariantUpdate(productVariant, options)
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
      product_id: {
        type: Sequelize.INTEGER,
        unique: 'productvariant_sku',
        // references: {
        //   model: 'Product',
        //   key: 'id'
        // }
      },
      // The SKU for this Variation
      sku: {
        type: Sequelize.STRING,
        unique: 'productvariant_sku',
        allowNull: false,
        set: function(val) {
          this.setDataValue('sku', app.services.ProxyCartService.sku(val))
        }
      },
      // Variant Title
      title: {
        type: Sequelize.STRING
      },
      // Variant Title
      type: {
        type: Sequelize.STRING
      },
      // The option that this Variant is
      option: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('ProductVariant', app, Sequelize, 'option', {
      //   // name: string, value:string
      //   defaultValue: {}
      // }),
      // Property Based Pricing
      property_pricing: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('ProductVariant', app, Sequelize, 'property_pricing', {
      //   defaultValue: {}
      // }),
      // The Barcode of the Variant
      barcode: {
        type: Sequelize.STRING
      },
      // Default price of the product in cents
      price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The calculated Price of the product
      calculated_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Competitor price of the variant in cents
      compare_at_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Default currency of the variant
      currency: {
        type: Sequelize.STRING,
        defaultValue: VARIANT_DEFAULTS.CURRENCY
      },
      // The discounts applied to the product
      discounted_lines: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('ProductVariant', app, Sequelize, 'discounted_lines', {
      //   defaultValue: []
      // }),
      // The total Discounts applied to the product
      total_discounts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total count of orders created with this product
      total_orders: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The fulfillment generic that handles this request
      fulfillment_service: {
        type: Sequelize.STRING,
        defaultValue: VARIANT_DEFAULTS.FULFILLMENT_SERVICE
      },
      // The order of the product variant in the list of product variants.
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      // Is product published
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue: VARIANT_DEFAULTS.PUBLISHED
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
        defaultValue: VARIANT_DEFAULTS.AVAILABLE
      },
      // If Variant needs to be shipped
      requires_shipping: {
        type: Sequelize.BOOLEAN,
        defaultValue: VARIANT_DEFAULTS.REQUIRES_SHIPPING
      },
      // If Product needs to be taxed
      requires_taxes: {
        type: Sequelize.BOOLEAN,
        defaultValue: VARIANT_DEFAULTS.REQUIRES_TAX
      },
      // If Variant requires a subscription
      requires_subscription: {
        type: Sequelize.BOOLEAN,
        defaultValue: VARIANT_DEFAULTS.REQUIRES_SUBSCRIPTION
      },
      // If Product has subscription, the interval of the subscription, defaults to 0 months
      subscription_interval: {
        type: Sequelize.INTEGER,
        defaultValue: VARIANT_DEFAULTS.SUBSCRIPTION_INTERVAL
      },
      // If product has subscription, the unit of the interval
      subscription_unit: {
        type: Sequelize.ENUM,
        values: values(INTERVALS),
        defaultValue: VARIANT_DEFAULTS.SUBSCRIPTION_UNIT
      },
      // Specifies whether or not Proxy Cart tracks the number of items in stock for this product variant.
      inventory_management: {
        type: Sequelize.BOOLEAN,
        defaultValue: VARIANT_DEFAULTS.INVENTORY_MANAGEMENT
      },
      // Specifies whether or not customers are allowed to place an order for a product variant when it's out of stock.
      inventory_policy: {
        type: Sequelize.ENUM,
        values: values(INVENTORY_POLICY),
        defaultValue: VARIANT_DEFAULTS.INVENTORY_POLICY
      },
      // Amount of variant in inventory
      inventory_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: VARIANT_DEFAULTS.INVENTORY_QUANTITY
      },
      // The average amount of days to come in stock if out of stock
      inventory_lead_time: {
        type: Sequelize.INTEGER,
        defaultValue: VARIANT_DEFAULTS.INVENTORY_LEAD_TIME
      },
      max_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: VARIANT_DEFAULTS.MAX_QUANTITY
      },
      // The tax code of the product, defaults to physical good.
      tax_code: {
        type: Sequelize.STRING,
        defaultValue: VARIANT_DEFAULTS.TAX_CODE // Physical Good
      },
      // Weight of the variant, defaults to grams
      weight: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Unit of Measurement for Weight of the variant, defaults to grams
      weight_unit: {
        type: Sequelize.ENUM,
        values: values(UNITS),
        defaultValue: VARIANT_DEFAULTS.WEIGHT_UNIT
      },
      // Google Specific Listings
      google: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('ProductVariant', app, Sequelize, 'google', {
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
      //   helpers.JSONB('ProductVariant', app, Sequelize, 'amazon', {
      //   defaultValue: {}
      // }),
      // If this product was created in Live Mode
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
    models.ProductVariant.belongsTo(models.Product, {
      foreignKey: 'product_id'
      // as: 'product_id',
      // foreign_key: 'id',
      // notNull: true
      // onDelete: 'CASCADE'
    })
    models.ProductVariant.belongsToMany(models.Shop, {
      as: 'shops',
      through: {
        model: models.ShopProduct,
        unique: false,
      },
      foreignKey: 'variant_id',
      // constraints: false
    })
    models.ProductVariant.belongsToMany(models.ProductVariant, {
      as: 'associations',
      through: {
        model: models.ProductAssociation,
        unique: false
        // scope: {
        //   model: 'product'
        // }
      },
      foreignKey: 'variant_id',
      otherKey: 'associated_variant_id'
      // constraints: false
    })
    models.ProductVariant.belongsToMany(models.ProductVariant, {
      as: 'relations',
      through: {
        model: models.ProductAssociation,
        unique: false
        // scope: {
        //   model: 'product'
        // }
      },
      foreignKey: 'associated_variant_id',
      otherKey: 'variant_id'
      // constraints: false
    })
    // models.ProductVariant.belongsTo(models.Product, {
    //   // foreignKey: 'variant_id',
    //   // as: 'product_id',
    //   onDelete: 'CASCADE'
    //   // foreignKey: {
    //   //   allowNull: false
    //   // }
    // })
    // models.ProductVariant.belongsToMany(models.Image, {
    //   as: 'images',
    //   through: {
    //     model: models.ItemImage,
    //     unique: false,
    //     scope: {
    //       model: 'variant'
    //     }
    //   },
    //   foreignKey: 'model_id',
    //   constraints: false
    // })
    models.ProductVariant.hasMany(models.ProductImage, {
      as: 'images',
      foreignKey: 'product_variant_id',
      through: null,
      onDelete: 'CASCADE'
      // foreignKey: {
      //   allowNull: false
      // }
    })
    models.ProductVariant.hasOne(models.Metadata, {
      as: 'metadata',
      foreignKey: 'product_variant_id'
    })
    models.ProductVariant.belongsToMany(models.Discount, {
      as: 'discounts',
      through: {
        model: models.ItemDiscount,
        unique: false,
        scope: {
          model: 'productvariant'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })

    models.ProductVariant.hasMany(models.OrderItem, {
      as: 'order_items',
      foreignKey: 'variant_id'
    })

    models.ProductVariant.belongsToMany(models.Event, {
      as: 'event_items',
      through: {
        model: models.EventItem,
        unique: false,
        scope: {
          object: 'productvariant'
        }
      },
      foreignKey: 'object_id',
      constraints: false
    })
    models.ProductVariant.belongsToMany(models.Vendor, {
      as: 'vendors',
      through: {
        model: models.VendorProduct,
        unique: false,
      },
      foreignKey: 'variant_id',
      // constraints: false
    })
    // models.ProductVariant.belongsToMany(models.Collection, {
    //   as: 'collections',
    //   through: {
    //     model: models.ItemCollection,
    //     unique: false,
    //     scope: {
    //       model: 'product_variant'
    //     }
    //   },
    //   foreignKey: 'model_id',
    //   constraints: false
    // })
  }
}

export interface ProductVariant {
  checkRestrictions(customer, shippingAddress): any
  checkAvailability(qty, options): any
  resolveImages(options): any
  resolveShops(options): any
  resolveDiscounts(options): any
  resolveMetadata(options): any
}


// TODO Resolve customer address and see if product is allowed to be sent there
ProductVariant.prototype.checkRestrictions = function(customer, shippingAddress) {
  return Promise.resolve(false)
}

// TODO check fulfillment policies from shops
ProductVariant.prototype.checkAvailability = function(qty, options: {[key: string]: any} = {}) {
  let allowed = true
  if (qty > this.inventory_quantity && this.inventory_policy === INVENTORY_POLICY.DENY) {
    allowed = false
    qty = Math.max(0, qty + ( this.inventory_quantity - qty))
  }
  if (this.inventory_policy === INVENTORY_POLICY.RESTRICT) {
    qty = Math.max(0, qty + ( this.inventory_quantity - qty))
  }

  const res: {[key: string]: any} = {
    title: this.title,
    allowed: allowed,
    quantity: qty
  }

  if (options.shop) {
    res.shop = options.shop
  }

  // return Promise.resolve(res)
  // TODO Resolve the actual Shop to use
  return this.resolveShops({ transaction: options.transaction || null })
    .then(() => {
      // console.log('BRK SHOPS', this.shops)
      if (!res.shop && this.shops.length > 0) {
        res.shop = this.shop[0]
      }
      return res
    })
    .catch(err => {
      return res
    })
}

ProductVariant.prototype.resolveShops = function(options: {[key: string]: any} = {}) {
  if (
    this.shops
    && this.shops.length > 0
    && this.shops.every(d => d instanceof this.app.models['Shop'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getShops({transaction: options.transaction || null})
      .then(_shops => {
        _shops = _shops || []
        this.shops = _shops
        this.setDataValue('shops', _shops)
        this.set('shops', _shops)
        return this
      })
  }
}

/**
 *
 */
ProductVariant.prototype.resolveImages = function(options: {[key: string]: any} = {}) {
  return this
}
/**
 *
 */
ProductVariant.prototype.resolveDiscounts = function(options: {[key: string]: any} = {}) {
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
ProductVariant.prototype.resolveMetadata = function(options: {[key: string]: any} = {}) {
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
        _metadata = _metadata || {product_variant_id: this.id}
        this.metadata = _metadata
        this.setDataValue('metadata', _metadata)
        this.set('metadata', _metadata)
        return this
      })
  }
}
