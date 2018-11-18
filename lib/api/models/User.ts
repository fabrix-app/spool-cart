import { User as PermissionsUser } from '@fabrix/spool-permissions/dist/api/models'
import { User as NotificationsUser } from '@fabrix/spool-notifications/dist/api/models'
import { Utils } from '@fabrix/spool-sequelize'
import { isString } from 'lodash'

export class User extends NotificationsUser {
  static config(app, Sequelize): {[key: string]: any} {
    return Utils.mergeConfig(NotificationsUser.config(app, Sequelize), {
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
          afterCreate: [
            (values, options) => {
              return app.services.ProxyCartService.afterUserCreate(values, options)
                .catch(err => {
                  return Promise.resolve(err)
                })
            }
          ]
        },
        getterMethods: {
          full_name: function () {
            if (this.first_name && this.last_name) {
              return `${ this.first_name } ${ this.last_name }`
            }
            else {
              return null
            }
          }
        }
      }
    })
  }

  static schema(app, Sequelize): {[key: string]: any} {

    return Utils.mergeConfig(PermissionsUser.schema(app, Sequelize), {
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
      // The current Shop ID this user is logged in with
      current_shop_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Shop',
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
      // The Reason a User Signed Up
      reason: {
        type: Sequelize.STRING
      },
      // Live Mode
      // TODO: Discussion: should this be moved to proxy permissions?
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('cart.live_mode')
      }
    })
  }

  public static associate (models) {
    // Apply passport specific stuff
    // PassportUser.associate(models)
    // Apply permission specific stuff
    // PermissionsUser.associate(models)
    // Apply notifications specific stuff
    NotificationsUser.associate(models)
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
    models.User.belongsTo(models.Shop, {
      as: 'current_shop',
      foreignKey: 'current_shop_id'
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

export interface User {
  toJSON(): any
  resolveMetadata(options): any
}

/**
 *
 */
User.prototype.resolveMetadata = function(options: {[key: string]: any} = {}) {
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
        _metadata = _metadata || {user_id: this.id}
        this.metadata = _metadata
        this.setDataValue('metadata', _metadata)
        this.set('metadata', _metadata)
        return this
      })
  }
}

/**
 * @returns {User}
 */
User.prototype.toJSON = function() {
  const resp = this instanceof this.app.models['User'].instance ? this.get({ plain: true }) : this
  // Transform Tags to array on toJSON
  if (resp.tags) {
    resp.tags = resp.tags.map(tag => {
      if (tag && isString(tag)) {
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
