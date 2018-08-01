import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { FabrixApp } from '@fabrix/fabrix'
import { isObject, isString, isNumber, defaultsDeep, pick, extend, values } from 'lodash'
import * as shortId from 'shortid'
import * as moment from 'moment'

import { TRANSACTION_ERRORS } from '../../enums'
import { TRANSACTION_STATUS } from '../../enums'
import { TRANSACTION_KIND } from '../../enums'
import { TRANSACTION_DEFAULTS } from '../../enums'

// tslint:disable:no-shadowed-variable
export class TransactionResolver extends SequelizeResolver {
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
 * @module Transaction
 * @description Transaction Model
 */
export class Transaction extends Model {

  static get resolver() {
    return TransactionResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          TRANSACTION_ERRORS: TRANSACTION_ERRORS,
          TRANSACTION_STATUS: TRANSACTION_STATUS,
          TRANSACTION_KIND: TRANSACTION_KIND,
          TRANSACTION_DEFAULTS: TRANSACTION_DEFAULTS
        },
        description: 'A Transaction is a representation of a purchasing event.',
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
              transaction.token = `transaction_${shortId.generate()}`
            }
          },
          afterCreate: (transaction, options) => {
            return app.services.TransactionService.afterCreate(transaction, options)
              .catch(err => {
                return Promise.reject(err)
              })
          },
          afterUpdate: (transaction, options) => {
            return app.services.TransactionService.afterUpdate(transaction, options)
              .catch(err => {
                return Promise.reject(err)
              })
          }
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // Unique identifier for a particular order.
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      customer_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Customer',
        //   key: 'id'
        // },
        allowNull: true
      },
      order_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Order',
        //   key: 'id'
        // },
        allowNull: false
      },
      source_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Order',
        //   key: 'id'
        // },
        allowNull: true
      },
      // TODO Enable User
      // The unique identifier for the user.
      // user_id: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'User',
      //     key: 'id'
      //   }
      // },
      // The amount of money that the transaction was for.
      amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The authorization code associated with the transaction.
      authorization: {
        type: Sequelize.STRING
      },
      // The date the authorization expires
      authorization_exp: {
        type: Sequelize.DATE,
        defaultValue: moment()
          .subtract(app.config.get('cart.transactions.authorization_exp_days') || 0, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
      },
      // The unique identifier for the device.
      device_id: {
        type: Sequelize.STRING
      },
      // The name of the gateway the transaction was issued through
      gateway: {
        type: Sequelize.STRING
      },
      // The origin of the transaction.
      source_name: {
        type: Sequelize.STRING,
        defaultValue: TRANSACTION_DEFAULTS.SOURCE_NAME
      },
      // An object containing information about the credit card used for this transaction. Normally It has the following properties:
      // type: The type of Source: credit_card, debit_card, prepaid_card, apple_pay, bitcoin
      // gateway: the Gateway used
      // avs_result_code: The Response code from AVS the address verification system.
      // The code is a single letter; see this chart for the codes and their definitions.
      // credit_card_iin: The issuer identification number (IIN),
      // formerly known as bank identification number (BIN) ] of the customer's credit card.
      // This is made up of the first few digits of the credit card number.
      // credit_card_company: The name of the company who issued the customer's credit card.
      // credit_card_number: The customer's credit card number, with most of the leading digits redacted with Xs.
      // cvv_result_code: The Response code from the credit card company indicating whether
      // the customer entered the card security code, a.k.a. card verification value, correctly.
      // The code is a single letter or empty string;
      // see this chart http://www.emsecommerce.net/avs_cvv2_response_codes.htm for the codes and their definitions.
      // token: The card token from the Gateway
      payment_details: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('Transaction', app, Sequelize, 'payment_details', {
      //   defaultValue: {}
      // }),
      // The kind of transaction:
      kind: {
        type: Sequelize.ENUM,
        values: values(TRANSACTION_KIND),
        allowNull: false
      },
      // A transaction reciept attached to the transaction by the gateway.
      // The value of this field will vary depending on which gateway the shop is using.
      receipt: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('Transaction', app, Sequelize, 'receipt', {
      //   defaultValue: {}
      // }),
      // A standardized error code, independent of the payment provider. Value can be null.
      error_code: {
        type: Sequelize.ENUM,
        values: values(TRANSACTION_ERRORS)
      },
      // The status of the transaction. Valid values are: pending, failure, success or error.
      status: {
        type: Sequelize.ENUM,
        values: values(TRANSACTION_STATUS),
        defaultValue: TRANSACTION_STATUS.PENDING
      },
      // The three letter code (ISO 4217) for the currency used for the payment.
      currency: {
        type: Sequelize.STRING,
        defaultValue: app.config.get('cart.default_currency') || TRANSACTION_DEFAULTS.CURRENCY
      },
      // A description of the Transaction
      description: {
        type: Sequelize.STRING
      },
      // The datetime the last retry was at
      retry_at: {
        type: Sequelize.DATE
      },
      // The total amounts of retries
      total_retry_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The datetime the transaction was cancelled
      cancelled_at: {
        type: Sequelize.DATE
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
  public static associate (models) {
    // models.Transaction.belongsTo(models.Refund, {
    //
    // })
    models.Transaction.belongsTo(models.Order, {
      // as: 'Order',
      // allowNull: false
    })
    models.Transaction.belongsTo(models.Customer, {
      // as: 'Customer',
      // allowNull: true
    })
    models.Transaction.belongsTo(models.Source, {
      // as: 'Source',
      // allowNull: true
    })
  }
}

export interface Transaction {
  retry(): any
  cancel(): any
  resolveOrder(options): any
  reconcileOrderFinancialStatus(options): any
}

/**
 *
 */
Transaction.prototype.retry = function() {
  this.retry_at = new Date(Date.now())
  this.total_retry_attempts++

  if (this.description && Boolean(this.description.match(/retry (\d+)/g))) {
    this.description = this.description.replace(/retry (\d+)/g, `retry ${this.total_retry_attempts}`)
  }
  else {
    this.description = `${this.description || 'transaction'} retry ${this.total_retry_attempts}`
  }

  return this
}
/**
 *
 * @returns {*}
 */
Transaction.prototype.cancel = function() {
  this.cancelled_at = new Date(Date.now())
  this.status = TRANSACTION_STATUS.CANCELLED

  if (this.description && !this.description.includes('cancelled')) {
    this.description = `${this.description || 'transaction'} cancelled`
  }

  return this
}
/**
 *
 */
Transaction.prototype.resolveOrder = function(options: {[key: string]: any} = {}) {
  const Order = this.app.models['Order']
  if (
    this.Order
    && this.Order instanceof Order.instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getOrder({transaction: options.transaction || null})
      .then(order => {
        order = order || null
        this.Order = order
        this.setDataValue('Order', order)
        this.set('Order', order)
      })
  }
}
/**
 *
 */
Transaction.prototype.reconcileOrderFinancialStatus = function(options: {[key: string]: any} = {}) {
  const Order = this.app.models['Order']
  // If the status or the kind have not changed
  if (!this.changed('status') && !this.changed('kind')) {
    return Promise.resolve(this)
  }
  let resOrder
  return Order.findById(this.order_id, {
    // attributes: [
    //   'id',
    //   'name',
    //   'customer_id',
    //   'financial_status',
    //   'total_authorized',
    //   'total_captured',
    //   'total_refunds',
    //   'total_voided',
    //   'total_cancelled',
    //   'total_pending',
    //   'total_due'
    // ],
    transaction: options.transaction || null
  })
    .then(foundOrder => {
      if (!foundOrder) {
        throw new Error('Order could not be resolved for transaction')
      }
      resOrder = foundOrder
      return resOrder.saveFinancialStatus({transaction: options.transaction || null})
    })
    .then(() => {
      // Save the status changes
      return resOrder.saveStatus({transaction: options.transaction || null})
    })
    .then(() => {
      return this
    })
}
