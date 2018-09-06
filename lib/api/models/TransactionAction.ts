import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { isObject, isString, isNumber, defaultsDeep, pick, extend, values } from 'lodash'
import * as shortId from 'shortid'

// tslint:disable:no-shadowed-variable
export class TransactionActionResolver extends SequelizeResolver {
  batch(options, batch) {
    const self = this

    options.limit = options.limit || 100
    options.offset = options.offset || 0
    options.regressive = options.regressive || false

    const recursiveQuery = function(options) {
      let count = 0
      return self.findAndCountAll(options)
        .then(results => {
          count = results.count
          return batch(results.rows)
        })
        .then(batched => {
          if (count >= (options.regressive ? options.limit : options.offset + options.limit)) {
            options.offset = options.regressive ? 0 : options.offset + options.limit
            return recursiveQuery(options)
          }
          else {
            return Promise.resolve()
          }
        })
    }
    return recursiveQuery(options)
  }

  /**
   * Resolve by instance Function
   * @param transaction
   * @param options
   */
  resolveByInstance (transaction, options: {[key: string]: any} = {}) {
    return Promise.resolve(transaction)
  }
  /**
   * Resolve by id Function
   * @param transaction
   * @param options
   */
  resolveById (transaction, options: {[key: string]: any} = {}) {
    return this.findById(transaction.id, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Transaction ${transaction.id} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by token Function
   * @param transaction
   * @param options
   */
  resolveByToken (transaction, options: {[key: string]: any} = {}) {
    return this.findOne(this.app.services.SequelizeService.mergeOptionDefaults(options, {
      where: {
        token: transaction.token
      }
    }))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Transaction token ${transaction.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by number Function
   * @param transaction
   * @param options
   */
  resolveByNumber (transaction, options: {[key: string]: any} = {}) {
    return this.findById(transaction, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Transaction ${transaction.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by string Function
   * @param transaction
   * @param options
   */
  resolveByString (transaction, options: {[key: string]: any} = {}) {
    return this.findOne(this.app.services.SequelizeService.mergeOptionDefaults(options, {
      where: {
        code: transaction
      }
    }))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Transaction ${transaction} not found`)
        }
        return resUser
      })
  }
  /**
   * Primary Resolve Function
   * @param transaction
   * @param options
   */
  resolve(transaction, options: {[key: string]: any} = {}) {
    const resolvers = {
      'instance': transaction instanceof this.instance,
      'id': !!(transaction && isObject(transaction) && transaction.id),
      'token': !!(transaction && isObject(transaction) && transaction.token),
      'number': !!(transaction && isNumber(transaction)),
      'string': !!(transaction && isString(transaction))
    }
    const type = Object.keys(resolvers).find((key) => resolvers[key])

    switch (type) {
      case 'instance': {
        return this.resolveByInstance(transaction, options)
      }
      case 'id': {
        return this.resolveById(transaction, options)
      }
      case 'token': {
        return this.resolveByToken(transaction, options)
      }
      case 'number': {
        return this.resolveByNumber(transaction, options)
      }
      case 'string': {
        return this.resolveByString(transaction, options)
      }
      default: {
        // TODO create proper error
        const err = new Error(`Unable to resolve Transaction ${transaction}`)
        return Promise.reject(err)
      }
    }
  }
}

/**
 * @module TransactionAction
 * @description TransactionAction Model
 */
export class TransactionAction extends Model {

  static get resolver() {
    return TransactionActionResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
        },
        description: 'A Transaction Action is a representation of a transaction event.',
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
          },
          authorized: {
            where: {
              kind: 'authorize',
              status: 'success'
            }
          },
          captured: {
            where: {
              kind: ['capture', 'sale'],
              status: 'success'
            }
          },
          voided: {
            where: {
              kind: 'void',
              status: 'success'
            }
          },
          refunded: {
            where: {
              kind: 'refund',
              status: 'success'
            }
          }
        },
        hooks: {
          beforeCreate: (transaction, options) => {
            if (!transaction.token) {
              transaction.token = `action_${shortId.generate()}`
            }
          },
          // afterCreate: (transaction, options) => {
          //   return app.services.TransactionService.afterCreate(transaction, options)
          //     .catch(err => {
          //       return Promise.reject(err)
          //     })
          // },
          // afterUpdate: (transaction, options) => {
          //   return app.services.TransactionService.afterUpdate(transaction, options)
          //     .catch(err => {
          //       return Promise.reject(err)
          //     })
          // }
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // Unique identifier for a particular transaction.
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Customer',
        //   key: 'id'
        // },
        allowNull: true
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
    // models.Transaction.belongsTo(models.Refund, {
    //
    // })
    // models.Transaction.belongsTo(models.Order, {
    //   // as: 'Order',
    //   // allowNull: false
    // })
    // models.Transaction.belongsTo(models.Customer, {
    //   // as: 'Customer',
    //   // allowNull: true
    // })
    // models.Transaction.belongsTo(models.Account, {
    //   // as: 'Source',
    //   // allowNull: true
    // })
    // models.Transaction.belongsTo(models.Source, {
    //   // as: 'Source',
    //   // allowNull: true
    // })
  }
}
