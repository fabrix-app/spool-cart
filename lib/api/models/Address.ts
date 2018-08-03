import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { defaultsDeep, isObject, isNumber, isString, defaults, pick } from 'lodash'
import * as shortId from 'shortid'

export class AddressResolver extends SequelizeResolver {
  /**
   * Returns a clean address
   */
  cleanAddress (address) {
    return pick(address, [
      'address_1',
      'address_2',
      'address_3',
      'company',
      'city',
      'prefix',
      'first_name',
      'last_name',
      'suffix',
      'phone',
      'province',
      'province_code',
      'country',
      'country_name',
      'country_code',
      'postal_code'
    ])
  }
  /**
   * Resolve by instance Function
   * @param address
   * @param options
   */
  resolveByInstance (address, options: {[key: string]: any} = {}) {
    return Promise.resolve(address)
  }
  /**
   * Resolve by id Function
   * @param address
   * @param options
   */
  resolveById (address, options: {[key: string]: any} = {}) {
    return this.findById(address.id, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Address ${address.id} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by token Function
   * @param address
   * @param options
   */
  resolveByToken (address, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        token: address.token
      }
    }, options))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Address token ${address.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by number Function
   * @param address
   * @param options
   */
  resolveByNumber (address, options: {[key: string]: any} = {}) {
    return this.findById(address, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Address ${address.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by string Function
   * @param address
   * @param options
   */
  resolveByString (address, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        token: address
      }
    }, options))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Address ${address} not found`)
        }
        return resUser
      })
  }
  /**
   * Primary Resolve Function
   * @param address
   * @param options
   */
  resolve(address, options: {[key: string]: any} = {}) {
    const resolvers = {
      'instance': address instanceof this.instance,
      'id': !!(address && isObject(address) && address.id),
      'token': !!(address && isObject(address) && address.token),
      'number': !!(address && isNumber(address)),
      'string': !!(address && isString(address))
    }
    const type = Object.keys(resolvers).find((key) => resolvers[key])

    switch (type) {
      case 'instance': {
        return this.resolveByInstance(address, options)
      }
      case 'id': {
        return this.resolveById(address, options)
      }
      case 'token': {
        return this.resolveByToken(address, options)
      }
      case 'number': {
        return this.resolveByNumber(address, options)
      }
      case 'string': {
        return this.resolveByString(address, options)
      }
      default: {
        // TODO create proper error
        const err = new Error(`Unable to resolve Address ${address}`)
        return Promise.reject(err)
      }
    }
  }
}

/**
 * @module Address
 * @description Address Model
 */
export class Address extends Model {

  static get resolver() {
    return AddressResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        scopes: {
          live: {
            where: {
              live_mode: true
            }
          }
        },
        hooks: {
          beforeValidate: [
            (values, options) => {
              try {
                values = app.services.ProxyCartService.normalizeAddress(values)
                // return fn(null, values)
              }
              catch (err) {
                return Promise.resolve(err)
                // return fn(err, values)
              }
            }
          ],
          beforeCreate: [
            (values, options) => {

              if (!values.token) {
                values.token = `address_${shortId.generate()}`
              }

              return app.services.GeolocationGenericService.locate(values)
                .then(latLng => {
                  values = defaults(values, latLng)
                  // return fn(null, values)
                })
                .catch(err => {
                  // Don't break over Geolocation failure
                  app.log.error(err)
                  // return fn(null, values)
                })
            }
          ],
          beforeUpdate: [
            (values, options) => {
              return app.services.GeolocationGenericService.locate(values)
                .then(latLng => {
                  values = defaults(values, latLng)
                  // return fn(null, values)
                })
                .catch(err => {
                  // Don't break over Geolocation failure
                  app.log.error(err)
                  return values
                })
            }
          ]
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // Unique identifier for a particular source.
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      // Line 1
      address_1: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Line 2
      address_2: {
        type: Sequelize.STRING
      },
      // Line 3
      address_3: {
        type: Sequelize.STRING
      },
      // Company
      company: {
        type: Sequelize.STRING
      },
      // City
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Name Prefix eg. Dr.
      prefix: {
        type: Sequelize.STRING
      },
      // First Name
      first_name: {
        type: Sequelize.STRING
      },
      // Last Name
      last_name: {
        type: Sequelize.STRING
      },
      // Name Suffix eg. Jr.
      suffix: {
        type: Sequelize.STRING
      },
      // Phone
      phone: {
        type: Sequelize.STRING
      },
      // Province/State
      province: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Province/State abbr
      province_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Country
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Country Code iso-alpha-2
      country_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Country Name
      country_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Postal/Zip Code
      postal_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Geographic coordinate specifying the north/south location of a shop.
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.000000,
        validate: {
          min: -90,
          max: 90
        }
      },
      // Geographic coordinate specifying the east/west location of a shop.
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.000000,
        validate: {
          min: -180,
          max: 180
        }
      },
      // The address as a String
      formatted_address: {
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
  public static associate(models) {
    models.Address.belongsToMany(models.Customer, {
      foreignKey: 'address_id',
      // otherKey: 'model_id',
      through: {
        model: models.ItemAddress,
        scope: {
          model: 'customer'
        },
        // constraints: false
      },
      constraints: false
    })
    models.Address.belongsToMany(models.Shop, {
      foreignKey: 'address_id',
      // otherKey: 'model_id',
      through: {
        model: models.ItemAddress,
        scope: {
          model: 'shop'
        },
        // constraints: false
      },
      constraints: false
    })
    models.Address.belongsToMany(models.Cart, {
      foreignKey: 'address_id',
      // otherKey: 'model_id',
      through: {
        model: models.ItemAddress,
        scope: {
          model: 'cart'
        },
        // constraints: false
      },
      constraints: false
    })
    models.Address.belongsToMany(models.Vendor, {
      foreignKey: 'address_id',
      // otherKey: 'model_id',
      through: {
        model: models.ItemAddress,
        scope: {
          model: 'vendor'
        },
        // constraints: false
      },
      constraints: false
    })
  }
}

export interface Address {
  merge(updates): any
}

Address.prototype.merge = function(updates) {

  this.address_1 = updates.address_1 || this.address_1
  this.address_2 = updates.address_2 || this.address_2
  this.address_3 = updates.address_3 || this.address_3
  this.company = updates.company || this.company
  this.city = updates.city || this.city
  this.prefix = updates.prefix || this.prefix
  this.first_name = updates.first_name || this.first_name
  this.last_name = updates.last_name || this.last_name
  this.suffix = updates.suffix || this.suffix
  this.phone = updates.phone || this.phone
  this.province = updates.province || this.province
  this.province_code = updates.province_code || this.province_code
  this.country = updates.country || this.country
  this.country_name = updates.country_name || this.country_name
  this.country_code = updates.country_code || this.country_code
  this.postal_code = updates.postal_code || this.postal_code
  this.formatted_address = updates.formatted_address || this.formatted_address
  this.latitude = updates.latitude || this.latitude
  this.longitude = updates.longitude || this.longitude

  if (this.address_1 === '') {
    this.address_1 = null
  }
  if (this.address_2 === '') {
    this.address_2 = null
  }
  if (this.address_3 === '') {
    this.address_3 = null
  }
  if (this.company === '') {
    this.company = null
  }
  if (this.city === '') {
    this.city = null
  }
  if (this.prefix === '') {
    this.prefix = null
  }
  if (this.first_name === '') {
    this.first_name = null
  }
  if (this.last_name === '') {
    this.last_name = null
  }
  if (this.suffix === '') {
    this.suffix = null
  }
  if (this.phone === '') {
    this.phone = null
  }
  if (this.province === '') {
    this.province = null
  }
  if (this.province_code === '') {
    this.province_code = null
  }
  if (this.country === '') {
    this.country = null
  }
  if (this.country_code === '') {
    this.country_code = null
  }
  if (this.country_name === '') {
    this.country_name = null
  }
  if (this.postal_code === '') {
    this.postal_code = null
  }
  if (this.formatted_address === '') {
    this.formatted_address = null
  }
  if (this.latitude === '') {
    this.latitude = null
  }
  if (this.longitude === '') {
    this.longitude = null
  }

  return this
}
