import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
const _ = require('lodash')
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { TRANSACTION_STATUS } from '../../enums'
import { TRANSACTION_KIND } from '../../enums'
const moment = require('moment')

/**
 * @module TransactionService
 * @description Transaction Service
 */
export class TransactionService extends Service {

  /**
   *
   * @param transaction
   * @param options
   * @returns {transaction}
   */
  create(transaction, options: {[key: string]: any} = {}) {
    const Transaction = this.app.models.Transaction
    return Transaction.create(transaction, options)
  }

  /**
   *
   * @param transaction
   * @param options
   * @returns {Promise.<transaction>}
   */
  authorize(transaction, options: {[key: string]: any} = {}) {
    const Transaction = this.app.models['Transaction']
    return Transaction.resolve(transaction, {transaction: options.transaction || null})
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction not found')
        }
        return this.app.services.PaymentService.authorize(_transaction, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param transaction
   * @param options
   * @returns {Promise.<transaction>}
   */
  capture(transaction, options: {[key: string]: any} = {}) {
    const Transaction = this.app.models['Transaction']
    return Transaction.resolve(transaction, {transaction: options.transaction || null})
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction not found')
        }
        if (_transaction.kind !== TRANSACTION_KIND.AUTHORIZE) {
          throw new ModelError('E_NOT_FOUND', `Transaction must be first be ${TRANSACTION_KIND.AUTHORIZE} to ${TRANSACTION_KIND.CAPTURE}`)
        }
        return this.app.services.PaymentService.capture(_transaction, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param transaction
   * @param options
   * @returns {Promise.<transaction>}
   */
  sale(transaction, options: {[key: string]: any} = {}) {
    const Transaction = this.app.models['Transaction']
    return Transaction.resolve(transaction, {transaction: options.transaction || null})
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction not found')
        }
        return this.app.services.PaymentService.sale(_transaction, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param transaction
   * @param options
   * @returns {Promise.<transaction>}
   */
  void(transaction, options: {[key: string]: any} = {}) {
    const Transaction = this.app.models['Transaction']
    return Transaction.resolve(transaction, {transaction: options.transaction || null})
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction not found')
        }
        if (_transaction.status !== TRANSACTION_STATUS.SUCCESS) {
          throw new Error('Transaction must have successful to be refunded')
        }
        return this.app.services.PaymentService.void(_transaction, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param transaction
   * @param amount
   * @param options
   * @returns {Promise.<T>}
   */
  partiallyVoid(transaction, amount, options: {[key: string]: any} = {}) {
    const Transaction = this.app.models['Transaction']
    let resTransaction
    return Transaction.resolve(transaction, {transaction: options.transaction || null})
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction Not Found')
        }
        if (_transaction.status !== TRANSACTION_STATUS.SUCCESS) {
          throw new Error('Transaction must have successful to be voided')
        }
        if (_transaction.kind !== TRANSACTION_KIND.AUTHORIZE) {
          throw new Error(`Transaction must be ${TRANSACTION_KIND.AUTHORIZE} to be partially voided`)
        }
        resTransaction = _transaction
        resTransaction.amount = Math.max(0, resTransaction.amount - amount)
        return resTransaction.save({transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param transaction
   * @param options
   * @returns {Promise.<T>}
   */
  refund(transaction, options: {[key: string]: any} = {}) {
    const Transaction = this.app.models['Transaction']
    let resTransaction
    return Transaction.resolve(transaction, {transaction: options.transaction || null})
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction not found')
        }
        if (_transaction.status !== TRANSACTION_STATUS.SUCCESS) {
          throw new Error('Transaction must have been successful to be refunded')
        }
        if ([TRANSACTION_KIND.CAPTURE, TRANSACTION_KIND.SALE].indexOf(_transaction.kind) === -1) {
          throw new Error(`Only Transactions that are ${TRANSACTION_KIND.CAPTURE} or ${TRANSACTION_KIND.SALE} can be refunded`)
        }
        resTransaction = _transaction
        return this.app.services.PaymentService.refund(resTransaction, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param transaction
   * @param amount
   * @param options
   * @returns {Promise.<T>}
   */
  // TODO, double check if partial or full refund
  partiallyRefund(transaction, amount, options: {[key: string]: any} = {}) {
    const Transaction = this.app.models['Transaction']
    let resTransaction
    return Transaction.resolve(transaction, {transaction: options.transaction || null})
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction Not Found')
        }
        if (!(_transaction instanceof Transaction.instance)) {
          throw new Error('Transaction did not resolve an instance')
        }
        if (_transaction.status !== TRANSACTION_STATUS.SUCCESS) {
          throw new Error('Transaction must have been successful to be refunded')
        }
        if ([TRANSACTION_KIND.CAPTURE, TRANSACTION_KIND.SALE].indexOf(_transaction.kind) === -1) {
          throw new Error(`Only Transactions that are ${TRANSACTION_KIND.CAPTURE} or ${TRANSACTION_KIND.SALE} can be refunded`)
        }
        resTransaction = _transaction
        resTransaction.amount = Math.max(0, resTransaction.amount - amount)
        return resTransaction.save({transaction: options.transaction || null})
      })
      .then(() => {
        const newTransaction = _.omit(resTransaction.get({plain: true}), ['id', 'token'])
        newTransaction.amount = amount
        return this.create(newTransaction, {transaction: options.transaction || null})
      })
      .then(newTransaction => {
        return this.app.services.PaymentService.refund(newTransaction, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param transaction
   * @param options
   * @returns {Promise.<T>}
   */
  cancel(transaction, options: {[key: string]: any} = {}) {
    const Transaction = this.app.models['Transaction']
    let resTransaction
    return Transaction.resolve(transaction, {transaction: options.transaction || null})
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction Not Found')
        }
        if (!(_transaction instanceof Transaction.instance)) {
          throw new Error('Transaction did not resolve an instance')
        }
        if ([TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.FAILURE].indexOf(_transaction.status) === -1) {
          throw new Error('Transaction can not be cancelled if it is not pending or failed')
        }
        resTransaction = _transaction
        return this.app.services.PaymentService.cancel(resTransaction, {transaction: options.transaction || null})
      })
  }

  /**
   * Try a transaction or retry a transaction
   * @param transaction
   * @param options
   * @returns {Promise.<T>}
   */
  retry(transaction, options: {[key: string]: any} = {}) {
    const Transaction = this.app.models['Transaction']
    let resTransaction
    return Transaction.resolve(transaction, {transaction: options.transaction || null})
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction Not Found')
        }
        if (!(_transaction instanceof Transaction.instance)) {
          throw new Error('Transaction did not resolve an instance')
        }
        if ([TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.FAILURE].indexOf(_transaction.status) === -1) {
          throw new Error('Transaction can not be tried if it is not pending or has not failed')
        }
        resTransaction = _transaction
        return this.app.services.PaymentService.retry(resTransaction, {transaction: options.transaction || null})
      })
  }

  reconcileCreate(order, amount, options: {[key: string]: any} = {}) {
    const Order = this.app.models['Order']
    const Transaction = this.app.models['Transaction']
    const Customer = this.app.models['Customer']
    let resOrder, totalNew = 0, availablePending = []
    return Order.resolve(order, {transaction: options.transaction || null})
      .then(_order => {
        if (!_order) {
          throw new ModelError('E_NOT_FOUND', 'Order Not Found')
        }
        if (!(_order instanceof Order.instance)) {
          throw new Error('Order did not resolve an instance')
        }
        resOrder = _order
        return resOrder.resolveTransactions({transaction: options.transaction || null})
      })
      .then(() => {
        return resOrder.resolveCustomer({transaction: options.transaction || null})
      })
      .then(() => {
        totalNew = amount
        availablePending = resOrder.transactions.filter(transaction =>
        transaction.status === TRANSACTION_STATUS.PENDING
        && [TRANSACTION_KIND.AUTHORIZE, TRANSACTION_KIND.SALE].indexOf(transaction.kind) > -1)

        // If a pending authorize or sale transaction just add the new amount total to one of the transactions
        if (availablePending.length > 0) {
          availablePending[0].amount = availablePending[0].amount + totalNew
          return availablePending[0].save({
            hooks: false,
            transaction: options.transaction || null
          })
        }
        else {
          // TODO get Source info
          if (!(resOrder.Customer instanceof Customer.instance)) {
            return null
          }
          else {
            return resOrder.Customer.getDefaultSource({transaction: options.transaction || null})
              .then(resSource => {

                if (!resSource) {
                  throw new Error('Order Customer is missing a default source')
                }

                const transaction = Transaction.build({
                  // Set the customer id (in case we can save this source)
                  customer_id: resOrder.customer_id,
                  // Set the order id
                  order_id: resOrder.id,
                  // Set the source if it is given
                  source_id: resSource ? resSource.id : null,
                  // Set the order currency
                  currency: resOrder.currency,
                  // Set the amount for this transaction and handle if it is a split transaction
                  amount: totalNew,
                  // Copy the entire payment details to this transaction
                  payment_details: {
                    gateway: resSource ? resSource.gateway : null,
                    source: resSource,
                  },
                  // Specify the gateway to use
                  gateway: resSource.gateway,
                  // Set the device (that input the credit card) or null
                  device_id: resSource ? resSource.device_id : null,
                  // The kind of this new transaction
                  kind: resOrder.payment_kind,
                  // Set the Description
                  description: `Order ${resOrder.name} original transaction ${resOrder.payment_kind}`
                })
                // Process the transaction
                return this.app.services.PaymentService[resOrder.transaction_kind](transaction, {
                  hooks: false,
                  transaction: options.transaction || null
                })
              })
              .then(transaction => {
                // resOrder.addTransaction(transaction) has an updatedAt bug
                if (transaction) {
                  const transactions = resOrder.transactions.concat(transaction)
                  resOrder.transactions = transactions
                  resOrder.setDataValue('transactions', transactions)
                  resOrder.set('transactions', transactions)
                }

                return transaction
              })
          }
        }
      })
      .then(() => {
        return resOrder// .reload()
      })
  }

  /**
   *
   * @param order
   * @param amount
   * @param options
   * @returns {Promise.<TResult>}
   */
  reconcileUpdate(order, amount, options: {[key: string]: any} = {}) {
    const Order = this.app.models['Order']
    let resOrder,
      totalNew = 0,
      availablePending = [],
      availableAuthorized = [],
      availableRefund = [],
      toUpdate = []

    return Order.resolve(order, {transaction: options.transaction || null})
      .then(_order => {
        if (!_order) {
          throw new ModelError('E_NOT_FOUND', 'Order Not Found')
        }
        if (!(_order instanceof Order.instance)) {
          throw new Error('Order did not resolve an instance')
        }
        resOrder = _order
        return resOrder.resolveTransactions({transaction: options.transaction || null})
      })
      .then(() => {
        totalNew = amount

        availablePending = resOrder.transactions.filter(transaction =>
        transaction.status === TRANSACTION_STATUS.PENDING
        && [TRANSACTION_KIND.SALE, TRANSACTION_KIND.CAPTURE, TRANSACTION_KIND.AUTHORIZE].indexOf(transaction.kind) > -1)
          .sort((a, b) => {
            return b.amount - a.amount
          })

        availableAuthorized = resOrder.transactions.filter(transaction =>
        transaction.status === TRANSACTION_STATUS.SUCCESS
        && [TRANSACTION_KIND.AUTHORIZE].indexOf(transaction.kind) > -1)
          .sort((a, b) => {
            return b.amount - a.amount
          })

        availableRefund = resOrder.transactions.filter(transaction =>
        transaction.status === TRANSACTION_STATUS.SUCCESS
        && [TRANSACTION_KIND.CAPTURE, TRANSACTION_KIND.SALE].indexOf(transaction.kind) > -1)
          .sort((a, b) => {
            return b.amount - a.amount
          })

        availablePending.forEach(transaction => {
          if (totalNew > 0) {
            const oldAmount = transaction.amount
            const newAmount = Math.max(0, transaction.amount - totalNew)
            totalNew = totalNew - oldAmount
            transaction.amount = newAmount
            toUpdate.push(transaction.save({
              hooks: false,
              transaction: options.transaction || null
            }))
          }
        })
        availableAuthorized.forEach(transaction => {
          if (totalNew > 0) {
            const oldAmount = transaction.amount
            const newAmount = Math.max(0, transaction.amount - totalNew)
            totalNew = totalNew - oldAmount
            toUpdate.push(this.partiallyVoid(transaction, oldAmount - newAmount, {
              hooks: false,
              transaction: options.transaction || null
            }))
          }
        })
        availableRefund.forEach(transaction => {
          if (totalNew > 0) {
            const oldAmount = transaction.amount
            const newAmount = Math.max(0, transaction.amount - totalNew)
            totalNew = totalNew - oldAmount
            toUpdate.push(this.partiallyRefund(transaction, oldAmount - newAmount, {
              hooks: false,
              transaction: options.transaction || null
            }))
          }
        })
        return Order.datastore.Promise.mapSeries(toUpdate, update => { return update })
      })
      .then(() => {
        return resOrder
      })
  }

  /**
   *
   * @returns {Promise.<TResult>}
   */
  retryThisHour() {
    const Transaction = this.app.models['Transaction']
    const start = moment().startOf('hour')
    const errors = []
    // let errorsTotal = 0
    let transactionsTotal = 0

    this.app.log.debug('TransactionService.retryThisHour', start.format('YYYY-MM-DD HH:mm:ss'))

    return Transaction.batch({
      where: {
        retry_at: {
          $or: {
            $lte: start.format('YYYY-MM-DD HH:mm:ss'),
            $eq: null
          }
        },
        total_retry_attempts: {
          $gte: 0,
          $lte: this.app.config.get('cart.transactions.retry_attempts') || 1
        },
        status: TRANSACTION_STATUS.FAILURE
      },
      regressive: true
    }, (transactions) => {
      const Sequelize = Transaction.sequelize
      return Sequelize.Promise.mapSeries(transactions, transaction => {
        return this.retry(transaction)
      })
        .then(results => {
          // Calculate Totals
          transactionsTotal = transactionsTotal + results.length
          return
        })
        .catch(err => {
          // errorsTotal++
          this.app.log.error(err)
          errors.push(err)
          return
        })
    })
      .then(transactions => {
        const results = {
          transactions: transactionsTotal,
          errors: errors
        }
        this.app.log.info(results)
        this.app.services.EngineService.publish('transactions.retry.complete', results)
        return results
      })
      .catch(err => {
        this.app.log.error(err)
        return
      })
  }

  /**
   *
   * @returns {Promise.<TResult>}
   */
  cancelThisHour() {
    const Transaction = this.app.models['Transaction']
    const errors = []
    const start = moment().startOf('hour')
      .subtract(this.app.config.get('cart.transactions.authorization_exp_days') || 0, 'days')

    // let errorsTotal = 0
    let transactionsTotal = 0

    this.app.log.debug('TransactionService.cancelThisHour', start.format('YYYY-MM-DD HH:mm:ss'))

    return Transaction.batch({
      where: {
        authorization_exp: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        total_retry_attempts: {
          $gte: this.app.config.get('cart.transactions.retry_attempts') || 1
        },
        status: TRANSACTION_STATUS.FAILURE
      },
      regressive: true
    }, (transactions) => {

      const Sequelize = Transaction.sequelize
      return Sequelize.Promise.mapSeries(transactions, transaction => {
        return this.cancel(transaction)
      })
        .then(results => {
          // Calculate Totals
          transactionsTotal = transactionsTotal + results.length
          return
        })
        .catch(err => {
          // errorsTotal++
          this.app.log.error(err)
          errors.push(err)
          return
        })
    })
      .then(transactions => {
        const results = {
          transactions: transactionsTotal,
          errors: errors
        }
        this.app.log.info(results)
        this.app.services.EngineService.publish('transactions.cancel.complete', results)
        return results
      })
      .catch(err => {
        this.app.log.error(err)
        return
      })
  }

  /**
   *
   * @param transaction
   * @param options
   * @returns {Promise.<transaction>}
   */
  afterCreate(transaction, options: {[key: string]: any} = {}) {
    return transaction.reconcileOrderFinancialStatus(this.app, options)
      .catch(err => {
        this.app.log.error(err)
        return transaction
      })
  }
  /**
   *
   * @param transaction
   * @param options
   * @returns {Promise.<transaction>}
   */
  afterUpdate(transaction, options: {[key: string]: any} = {}) {
    return transaction.reconcileOrderFinancialStatus(this.app, options)
      .catch(err => {
        this.app.log.error(err)
        return transaction
      })
  }
}

