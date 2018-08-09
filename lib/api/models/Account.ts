import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { isObject, isNumber, isString, defaultsDeep } from 'lodash'
import * as shortId from 'shortid'
import { Account as AccountQuery } from '../utils/queryDefaults/Account'

export class AccountResolver extends SequelizeResolver {
  findByIdDefault(id, options: {[key: string]: any} = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      AccountQuery.default(this.app),
      options
    )
    return this.findById(id, options)
  }

  /**
   * Resolve by instance Function
   * @param account
   * @param options
   */
  resolveByInstance (account, options: {[key: string]: any} = {}) {
    return Promise.resolve(account)
  }
  /**
   * Resolve by id Function
   * @param account
   * @param options
   */
  resolveById (account, options: {[key: string]: any} = {}) {
    if (!(account instanceof Object)) {
      return Promise.reject(new Error('resolveById requires an object with an id property'))
    }
    return this.findByIdDefault(account.id, options)
      .then(resAccount => {
        if (!resAccount && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Account ${account.id} not found`)
        }
        return resAccount
      })
  }

  /**
   *
   */
  resolveByGateway(account, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        gateway: account.gateway,
        customer_id: account.customer_id
      }
    }, options))
      .then(resAccount => {
        if (!resAccount) {
          throw new ModelError('E_NOT_FOUND', `Account with customer id ${account.customer_id} not found`)
        }
        return resAccount
      })
  }
  /**
   * Resolve by token Function
   * @param account
   * @param options
   */
  resolveByToken (account, options: {[key: string]: any} = {}) {
    if (!(account instanceof Object)) {
      return Promise.reject(new Error('resolveByToken requires an object with a token property'))
    }
    if (!(account.token)) {
      return Promise.reject(new Error('resolveByToken requires an object with a token property'))
    }
    return this.findOne(defaultsDeep({
      where: {
        token: account.token
      }
    }, options))
      .then(resAccount => {
        if (!resAccount) {
          throw new ModelError('E_NOT_FOUND', `Account with customer id ${account.customer_id} not found`)
        }
        return resAccount
      })
  }
  /**
   * Resolve by number Function
   * @param account
   * @param options
   */
  resolveByNumber (account, options: {[key: string]: any} = {}) {
    return this.findByIdDefault(account, options)
      .then(resAccount => {
        if (!resAccount && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Account ${account.token} not found`)
        }
        return resAccount
      })
  }
  /**
   * Resolve by string Function
   * @param account
   * @param options
   */
  resolveByString (account, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        token: account
      }
    }, options))
      .then(resAccount => {
        if (!resAccount) {
          throw new ModelError('E_NOT_FOUND', `Account with token ${account} not found`)
        }
        return resAccount
      })
  }
  /**
   * Primary Resolve Function
   * @param account
   * @param options
   */
  resolve(account, options: {[key: string]: any} = {}) {
    const resolvers = {
      'instance': account instanceof this.instance,
      'id': !!(account && isObject(account) && account.id),
      'token': !!(account && isObject(account) && account.token),
      'gateway': !!(account && isObject(account) && account.gateway && account.customer_id),
      'create': !!(account && isObject(account) && options.create !== false),
      'number': !!(account && isNumber(account)),
      'string': !!(account && isString(account))
    }

    const type = Object.keys(resolvers).find((key) => resolvers[key])

    switch (type) {
      case 'instance': {
        return this.resolveByInstance(account, options)
      }
      case 'id': {
        return this.resolveById(account, options)
      }
      case 'token': {
        return this.resolveByToken(account, options)
      }
      case 'gateway': {
        return this.resolveByGateway(account, options)
      }
      case 'create': {
        return this.create(account, options)
      }
      case 'number': {
        return this.resolveByNumber(account, options)
      }
      case 'string': {
        return this.resolveByString(account, options)
      }
      default: {
        // TODO create proper error
        const err = new Error(`Unable to resolve Account ${account}`)
        return Promise.reject(err)
      }
    }
  }
}

/**
 * @module Account
 * @description Account
 */
export class Account extends Model {

  static get resolver() {
    return AccountResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
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
        },
        hooks: {
          beforeCreate: [
            (values, options) => {
              // If not token was already created, create it
              if (!values.token) {
                values.token = `account_${shortId.generate()}`
              }
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
        // },
        allowNull: false
      },
      // Unique identifier for a particular source.
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      email: {
        type: Sequelize.STRING
      },
      gateway: {
        type: Sequelize.STRING,
        defaultValue: 'payment_processor'
      },
      // The foreign key attribute on the 3rd party provider
      foreign_key: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // The foreign id on the 3rd party provider
      foreign_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // If this is the default payment source for an account
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // The data from the 3rd party response
      data: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      // helpers.JSONB('Account', app, Sequelize, 'data', {
      //  defaultValue: {}
      // }),
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
    models.Account.belongsTo(models.Customer, {
      foreignKey: 'customer_id'
    })

    models.Account.belongsToMany(models.Source, {
      as: 'sources',
      through: {
        model: models.CustomerSource,
        unique: false
      },
      foreignKey: 'account_id'
      // constraints: false
    })

    models.Account.hasMany(models.AccountEvent, {
      as: 'account_events',
      foreignKey: 'account_id'
    })
  }
}
