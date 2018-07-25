import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

const ModelPassport = require('@fabrix/spool-passport/dist/api/models/User')
const ModelPermissions = require('@fabrix/spool-permissions/dist/api/models/User')
const ModelNotifications = require('@fabrix/spool-notifications/dist/api/models/User')
const _ = require('lodash')
// const shortid = require('shortid')

export class User extends Model {
  static get resolver() {
    return SequelizeResolver
  }

  static config(app, Sequelize) {
    return {
      options: {
        underscored: true,
        // defaultScope: {
        //   where: {
        //     live_mode: app.config.engine.live_mode
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
          afterCreate: [
            (values, options) => {
              return app.services.ProxyCartService.afterUserCreate(values, options)
                .catch(err => {
                  return Promise.resolve(err)
                })
            }
          ].concat(ModelPermissions.config(app, Sequelize).options.hooks.afterCreate)
        },
        getterMethods: {
          full_name: function()  {
            if (this.first_name && this.last_name) {
              return `${ this.first_name } ${ this.last_name }`
            }
            else {
              return null
            }
          }
        },
        classMethods: {
          findByIdDefault: ModelPermissions.config(app, Sequelize).options.classMethods.findByIdDefault,
          findOneDefault: ModelPermissions.config(app, Sequelize).options.classMethods.findOneDefault,
          resolve: ModelPassport.config(app, Sequelize).options.classMethods.resolve
        },
        instanceMethods: _.defaults({},
          ModelPassport.config(app, Sequelize).options.instanceMethods,
          ModelPermissions.config(app, Sequelize).options.instanceMethods,
          ModelNotifications.config(app, Sequelize).options.instanceMethods,
          {
            /**
             *
             * @param options
             * @returns {*}
             */
            resolveMetadata: function(options) {
              options = options || {}
              if (
                this.metadata
                && this.metadata instanceof app.models['Metadata'].instance
                && options.reload !== true
              ) {
                return Promise.resolve(this)
              }
              else {
                return this.getMetadata({transaction: options.transaction || null})
                  .then(_metadata => {
                    _metadata = _metadata || {user_id: this.id}
                    this.metadata = _metadata
                    this.setDataValue('metadata', _metadata)
                    this.set('metadata', _metadata)
                    return this
                  })
              }
            },
            toJSON: function() {
              const resp = this instanceof app.models['User'].instance ? this.get({ plain: true }) : this
              // Transform Tags to array on toJSON
              if (resp.tags) {
                resp.tags = resp.tags.map(tag => {
                  if (tag && _.isString(tag)) {
                    return tag
                  }
                  else if (tag && tag.name) {
                    return tag.name
                  }
                })
              }
              // Transform Metadata to plain on toJSON
              if (resp.metadata) {
                if (typeof resp.metadata.data !== 'undefined') {
                  resp.metadata = resp.metadata.data
                }
              }
              return resp
            }
          }
        )
      }
    }
  }
  static schema(app, Sequelize) {
    // return ModelPassport.schema(app, Sequelize)
    const PassportSpoolSchema = ModelPassport.schema(app, Sequelize)
    const PermissionsSpoolSchema = ModelPermissions.schema(app, Sequelize)

    const schema = {
      //
      accepts_marketing: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      // The current Customer ID this user is logged in with
      current_customer_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Customer',
        //   key: 'id'
        // },
        allowNull: true
      },
      // The current Cart ID this user is logged in with
      current_cart_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Cart',
        //   key: 'id'
        // },
        allowNull: true
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      // Live Mode
      // TODO: Discussion: should this be moved to proxy permissions?
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.engine.live_mode
      }
    }
    return _.defaults(PassportSpoolSchema, PermissionsSpoolSchema, schema)
  }

  public static associate (models) {
    // Apply passport specific stuff
    ModelPassport.associate(models)
    // Apply permission specific stuff
    ModelPermissions.associate(models)
    // Apply notifications specific stuff
    ModelNotifications.associate(models)
    // Apply your specific stuff
    models.User.belongsToMany(models.Customer, {
      as: 'customers',
      through: {
        model: models.CustomerUser,
        unique: true
      },
      foreignKey: 'user_id'
      // constraints: false
    })
    models.User.hasMany(models.Order, {
      as: 'orders',
      foreignKey: 'user_id'
    })

    models.User.belongsTo(models.Customer, {
      as: 'current_customer',
      foreignKey: 'current_customer_id'
    })
    models.User.belongsTo(models.Cart, {
      as: 'current_cart',
      foreignKey: 'current_cart_id',
      constraints: false
    })
    // models.User.belongsToMany(models.Cart, {
    //   as: 'carts',
    //   through: {
    //     model: models.CartUser,
    //     foreignKey: 'user_id',
    //     unique: true,
    //     constraints: false
    //   }
    // })
    models.User.hasOne(models.Metadata, {
      as: 'metadata',
      foreignKey: 'user_id'
    })
  }
}
