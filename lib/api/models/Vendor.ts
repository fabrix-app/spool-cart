import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'

import { isObject, defaultsDeep, isNumber, isString, pick, extend } from 'lodash'

export class VendorResolver extends SequelizeResolver {
  resolve(vendor, options: {[key: string]: any} = {}) {
    const VendorModel =  this
    // const Sequelize = VendorModel.sequelize

    if (vendor instanceof VendorModel.instance) {
      return Promise.resolve(vendor)
    }
    else if (vendor && isObject(vendor) && vendor.id) {
      return VendorModel.findById(vendor.id, options)
        .then(foundVendor => {
          if (!foundVendor) {
            throw new ModelError('E_NOT_FOUND', `VendorModel ${vendor.id} not found`)
          }
          return foundVendor
        })
    }
    else if (vendor && isObject(vendor) && vendor.handle) {
      return VendorModel.findOne(defaultsDeep({
        where: {
          handle: vendor.handle
        }
      }, options))
        .then(resVendor => {
          if (resVendor) {
            return resVendor
          }
          return VendorModel.create(vendor, { transaction: options.transaction || null})
        })
    }
    else if (vendor && isObject(vendor) && vendor.name) {
      return VendorModel.findOne(defaultsDeep({
        where: {
          name: vendor.name
        }
      }, options))
        .then(resVendor => {
          if (resVendor) {
            return resVendor
          }
          return VendorModel.create(vendor, { transaction: options.transaction || null})
        })
    }
    else if (vendor && isNumber(vendor)) {
      return VendorModel.findById(vendor, options)
        .then(resVendor => {
          if (!resVendor) {
            throw new ModelError('E_NOT_FOUND', `VendorModel ${vendor} not found`)
          }
          else {
            return resVendor
          }
        })
    }
    else if (vendor && isString(vendor)) {
      return VendorModel.findOne(defaultsDeep({
        where: {
          $or: {
            handle: vendor,
            name: vendor
          }
        }
      }, options))
        .then(resVendor => {
          if (!resVendor) {
            throw new ModelError('E_NOT_FOUND', `VendorModel ${vendor} not found`)
          }
          else {
            return resVendor
          }
        })
    }
    else {
      // TODO make Proper Error
      const err = new Error(`Not able to resolve vendor ${vendor}`)
      return Promise.reject(err)
    }
  }

  transformVendors(vendors = [], options: {[key: string]: any} = {}) {
      const VendorModel = this
      const Sequelize = VendorModel.sequelize

      vendors = vendors.map(vendor => {
        if (vendor && isNumber(vendor)) {
          vendor = {
            id: vendor
          }
          return vendor
        }
        else if (vendor && isString(vendor)) {
          vendor = {
            handle: this.app.services.ProxyCartService.handle(vendor),
            name: vendor
          }
          return vendor
        }
        else if (vendor && isObject(vendor)) {
          vendor.handle = vendor.handle || this.app.services.ProxyCartService.handle(vendor.name)
          return vendor
        }
      })

      vendors = vendors.filter(vendor => vendor)

      return Sequelize.Promise.mapSeries(vendors, vendor => {
        return VendorModel.findOne({
          where: pick(vendor, ['id', 'handle']),
          attributes: ['id', 'handle', 'name'],
          transaction: options.transaction || null
        })
        .then(foundVendor => {
          if (foundVendor) {
            return extend(foundVendor, vendor)
          }
          else {
            return VendorModel.create(vendor, {
              transaction: options.transaction || null
            })
          }
        })
      })
  }

  transform (vendor) {
    if (vendor && isObject(vendor)) {
      vendor.handle = vendor.handle || this.app.services.ProxyCartService.handle(vendor.name)
      return vendor
    }
    else if (vendor && isString(vendor)) {
      return {
        handle: this.app.services.ProxyCartService.handle(vendor),
        name: vendor
      }
    }
    else {
      return null
    }
  }

  /**
   *
   */
  reverseTransform(vendor) {
    if (typeof vendor.name !== 'undefined') {
      return vendor.name
    }
    return vendor
  }
}
/**
 * @module Vendor
 * @description Vendor Model
 */
export class Vendor extends Model {

  static get resolver() {
    return VendorResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
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
        hooks: {
          beforeValidate: [
            (values, options) => {
              if (!values.handle && values.name) {
                values.handle = values.name
              }
            }
          ]
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // The vendor handle
      handle: {
        type: Sequelize.STRING,
        notNull: true,
        unique: true,
        set: function(val) {
          this.setDataValue('handle', app.services.ProxyCartService.handle(val))
        }
      },
      // The vendor's name
      name: {
        type: Sequelize.STRING,
        notNull: true,
        set: function(val) {
          this.setDataValue('name', app.services.ProxyCartService.title(val))
        }
      },
      // The vendor's website
      website: {
        type: Sequelize.STRING
      },
      // The vendor's Phone number
      phone: {
        type: Sequelize.STRING
      },
      // The id of the vendor's shipping address
      shipping_address_id: {
        type: Sequelize.INTEGER
      },
      // The id of the vendor's billing address
      billing_address_id: {
        type: Sequelize.INTEGER
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
    models.Vendor.belongsTo(models.Address, {
      as: 'billing_address'
    })
    models.Vendor.belongsTo(models.Address, {
      as: 'shipping_address'
    })
    models.Vendor.belongsToMany(models.Address, {
      as: 'addresses',
      // otherKey: 'address_id',
      foreignKey: 'model_id',
      through: {
        model: models.ItemAddress,
        scope: {
          model: 'vendor'
        }
      },
      constraints: false
    })
    models.Vendor.belongsToMany(models.Product, {
      as: 'products',
      through: {
        model: models.VendorProduct
      },
      foreignKey: 'vendor_id'
      // constraints: false
    })
  }
}
