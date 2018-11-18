import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { pick, isString, isNumber, isObject, extend } from 'lodash'
import { UNITS } from '../../enums'

export class ShopResolver extends SequelizeResolver {
  /**
   * Resolve by instance Function
   * @param shop
   * @param options
   */
  resolveByInstance (shop, options: {[key: string]: any} = {}) {
    return Promise.resolve(shop)
  }
  /**
   * Resolve by id Function
   * @param shop
   * @param options
   */
  resolveById (shop, options: {[key: string]: any} = {}) {
    return this.findById(shop.id, options)
      .then(resShop => {
        if (!resShop && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Shop ${shop.id} not found`)
        }
        return resShop
      })
  }
  /**
   * Resolve by token Function
   * @param shop
   * @param options
   */
  resolveByToken (shop, options: {[key: string]: any} = {}) {
    return this.findOne(this.app.services.SequelizeService.mergeOptionDefaults(options, {
      where: {
        token: shop.token
      }
    }))
      .then(resShop => {
        if (!resShop && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Shop token ${shop.token} not found`)
        }
        return resShop
      })
  }
  /**
   * Resolve by handle Function
   * @param shop
   * @param options
   */
  resolveByHandle (shop, options: {[key: string]: any} = {}) {
    return this.findOne(this.app.services.SequelizeService.mergeOptionDefaults(options, {
      where: {
        handle: shop.handle
      }
    }))
      .then(resShop => {
        if (!resShop && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Shop handle ${shop.handle} not found`)
        }
        return resShop
      })
  }
  /**
   * Resolve by number Function
   * @param shop
   * @param options
   */
  resolveByNumber (shop, options: {[key: string]: any} = {}) {
    return this.findById(shop, options)
      .then(resShop => {
        if (!resShop && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Shop ${shop.token} not found`)
        }
        return resShop
      })
  }
  /**
   * Resolve by string Function
   * @param shop
   * @param options
   */
  resolveByString (shop, options: {[key: string]: any} = {}) {
    return this.findOne(this.app.services.SequelizeService.mergeOptionDefaults(options, {
      where: {
        code: shop
      }
    }))
      .then(resShop => {
        if (!resShop && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Shop ${shop} not found`)
        }
        return resShop
      })
  }

  /**
   *
   */
  resolveDefault(options: {[key: string]: any} = {}) {
    return this.findOne({
      transaction: options.transaction || null
    })
      .then(resShop => {
        if (!resShop && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', 'Shop not found')
        }
        return resShop
      })
  }
  /**
   * Primary Resolve Function
   * @param shop
   * @param options
   */
  resolve(shop, options: {[key: string]: any} = {}) {
    const resolvers = {
      'instance': shop instanceof this.instance,
      'id': !!(shop && isObject(shop) && shop.id),
      'token': !!(shop && isObject(shop) && shop.token),
      'handle': !!(shop && isObject(shop) && shop.handle),
      'number': !!(shop && isNumber(shop)),
      'string': !!(shop && isString(shop)),
      'default': options.default === true
    }
    const type = Object.keys(resolvers).find((key) => resolvers[key])

    switch (type) {
      case 'instance': {
        return this.resolveByInstance(shop, options)
      }
      case 'id': {
        return this.resolveById(shop, options)
      }
      case 'token': {
        return this.resolveByToken(shop, options)
      }
      case 'handle': {
        return this.resolveByHandle(shop, options)
      }
      case 'number': {
        return this.resolveByNumber(shop, options)
      }
      case 'string': {
        return this.resolveByString(shop, options)
      }
      case 'default': {
        return this.resolveDefault(options)
      }
      default: {
        // TODO create proper error
        const err = new Error(`Unable to resolve Shop ${shop}`)
        return Promise.reject(err)
      }
    }
  }
  /**
   *
   * @param shops
   * @param options
   * @returns {*}
   */
  transformShops (shops = [], options: {[key: string]: any} = {}) {
    const ShopModel = this
    const Sequelize = ShopModel.sequelize

    // Transform if necessary to objects
    shops = shops.map(shop => {
      if (shop && isNumber(shop)) {
        return { id: shop }
      }
      else if (shop && isString(shop)) {
        shop = { name: shop }
        return shop
      }
      else if (shop && isObject(shop)) {
        return shop
      }
    })
    // Filter out undefined
    shops = shops.filter(shop => shop)

    return Sequelize.Promise.mapSeries(shops, shop => {
      return ShopModel.findOne({
        where: pick(shop, ['id', 'handle']),
        attributes: ['id', 'name', 'handle'],
        transaction: options.transaction || null
      })
      .then(foundShop => {
        if (foundShop) {
          return extend(foundShop, shop)
        }
        else {
          return ShopModel.create(shop, {
            transaction: options.transaction || null
          })
        }
      })
    })
  }
}

/**
 * @module Shop
 * @description Shop Model
 */
export class Shop extends Model {

  static get resolver() {
    return ShopResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          UNITS: UNITS
        },
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
        hooks: {
          beforeValidate: [
            (shop, options) => {
              if (!shop.handle && shop.name) {
                shop.handle = shop.name
              }
            }
          ]
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // The name of the shop.
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // The Unique string for shop
      handle: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        set: function(val) {
          this.setDataValue('handle', app.services.ProxyCartService.handle(val))
        }
      },
      // The contact phone number for the shop.
      phone: {
        type: Sequelize.STRING
      },
      // The shop's primary language locale
      primary_locale: {
        type: Sequelize.STRING,
        defaultValue: 'en-us',
        allowNull: false
      },
      // The Address Id of the shop
      address_id: {
        type: Sequelize.INTEGER
      },
      // The three-letter code for the currency that the shop accepts.
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD',
        allowNull: false
      },
      // TODO Host? used to be domain: host is more congruent with ProxyRouter
      host: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // The contact email address for the shop.
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        }
      },
      // A string representing the way currency is formatted when the currency isn't specified.
      money_format: {
        type: Sequelize.STRING,
        defaultValue: '$',
        allowNull: false
      },
      // A string representing the way currency is formatted when the currency is specified.
      money_with_currency_format: {
        type: Sequelize.STRING,
        defaultValue: '$ USD',
        allowNull: false
      },
      // Specifies whether or not taxes were charged for shipping. Valid values are: "true" or "false."
      tax_shipping: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // The setting for whether applicable taxes are included in product prices. Valid values are: "true" or "null."
      taxes_included: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // The setting for whether the shop is applying taxes on a per-county basis or not (US-only). Valid values are: "true" or "null."
      county_taxes: {
        type: Sequelize.BOOLEAN
      },
      // The name of the timezone the shop is in.
      timezone: {
        type: Sequelize.STRING,
        defaultValue: '(GMT-05:00) Eastern Time',
        allowNull: false
      },
      // The named timezone assigned by the IANA.
      iana_timezone: {
        type: Sequelize.STRING,
        defaultValue: 'America/New_York',
        allowNull: false
      },
      // A string representing the default unit of weight measurement for the shop.
      weight_unit: {
        type: Sequelize.ENUM,
        values: Object.values(UNITS),
        defaultValue: UNITS.G
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
  public static associate (models) {
    models.Shop.belongsTo(models.Address, {
      as: 'address'
    })
    models.Shop.belongsToMany(models.Address, {
      as: 'addresses',
      // otherKey: 'address_id',
      foreignKey: 'model_id',
      through: {
        model: models.ItemAddress,
        scope: {
          model: 'shop'
        },
        constraints: false
      },
      constraints: false
    })
    models.Shop.hasMany(models.Cart, {
      as: 'carts',
      foreignKey: 'shop_id'
    })
    models.Shop.belongsToMany(models.Order, {
      as: 'orders',
      through: {
        model: models.ShopOrder,
        unique: true,
      },
      foreignKey: 'shop_id'
    })
    models.Shop.hasMany(models.OrderItem, {
      as: 'order_items',
      foreignKey: 'shop_id'
    })
    models.Shop.belongsToMany(models.Product, {
      as: 'products',
      through: {
        model: models.ShopProduct,
        foreignKey: 'shop_id',
        unique: false,
      },
      // constraints: false
    })
    models.Shop.belongsToMany(models.ProductVariant, {
      as: 'variants',
      through: {
        model: models.ShopProduct,
        foreignKey: 'shop_id',
        unique: false,
      },
      // constraints: false
    })
    models.Shop.belongsToMany(models.User, {
      as: 'users',
      through: {
        model: models.ShopUser,
        unique: true,
      },
      foreignKey: 'shop_id'
    })
    models.Shop.belongsToMany(models.Customer, {
      as: 'customers',
      through: {
        model: models.ShopCustomer,
        unique: true,
      },
      foreignKey: 'shop_id'
    })
  }
}
