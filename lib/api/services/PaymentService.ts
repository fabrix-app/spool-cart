


import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { TRANSACTION_STATUS } from '../../enums'
import { TRANSACTION_KIND } from '../../enums'
/**
 * @module PaymentService
 * @description Payment Service
 */
export class PaymentService extends Service {
  /**
   * Authorizes and amount
   * @param transaction
   * @param options
   * @returns {Promise.<T>}
   */
  authorize(transaction, options: {[key: string]: any} = {}) {
    transaction.description = transaction.description || 'Transaction Authorize'

    const Transaction = this.app.models.Transaction
    const paymentProcessor = this.app.config.get(`generics.${transaction.gateway}`)
      || this.app.config.get('generics.payment_processor')

    if (!(transaction instanceof Transaction)) {
      throw new Error('Transaction must be an instance')
    }
    if (!paymentProcessor || !paymentProcessor.adapter) {
      const err = new Error('Payment Processor is unspecified')
      return Promise.reject(err)
    }

    let resTransaction
    return this.app.services.PaymentGenericService.authorize(transaction, paymentProcessor)
      .then(_transaction => {
        if (!(_transaction instanceof Transaction)) {
          throw new Error('PaymentGenericService.authorize did not return Transaction instance')
        }
        return _transaction.save({transaction: options.transaction || null})
      })
      .then(_transaction => {
        resTransaction = _transaction
        // tslint:disable:max-line-length
        const event = {
          object_id: resTransaction.order_id,
          object: 'order',
          objects: [{
            order: resTransaction.order_id
          }, {
            transaction: resTransaction.id
          }],
          type: `order.transaction.authorize.${resTransaction.status}`,
          message: `Order ID ${ resTransaction.order_id} transaction authorize of ${ this.app.services.ProxyCartService.formatCurrency(resTransaction.amount, resTransaction.currency)} ${resTransaction.currency} ${resTransaction.status}`,
          data: resTransaction
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        return resTransaction
      })

  }

  /**
   * Captures and Authorized Amount
   * @param transaction
   * @param options
   * @returns {Promise.<T>}
   */
  capture(transaction, options: {[key: string]: any} = {}) {
    transaction.description = transaction.description || 'Transaction Capture'

    const Transaction = this.app.models['Transaction']
    const paymentProcessor = this.app.config.get(`generics.${transaction.gateway}`)
      || this.app.config.get('generics.payment_processor')

    if (!paymentProcessor || !paymentProcessor.adapter) {
      const err = new Error('Payment Processor is unspecified')
      return Promise.reject(err)
    }

    let resTransaction
    // Resolve the authorized transaction
    return Transaction.resolve(transaction, {transaction: options.transaction || null })
      .then(_transaction => {
        if (!(_transaction instanceof Transaction)) {
          throw new Error('Did not resolve a Transaction instance')
        }
        if (_transaction.kind !== TRANSACTION_KIND.AUTHORIZE) {
          throw new Error(`Transaction kind must be '${TRANSACTION_KIND.AUTHORIZE}' to be captured`)
        }
        if (_transaction.status !== TRANSACTION_STATUS.SUCCESS) {
          throw new Error(`Transaction status must be '${TRANSACTION_STATUS.SUCCESS}' to be captured`)
        }
        return this.app.services.PaymentGenericService.capture(_transaction, paymentProcessor)
      })
      .then(_transaction => {
        if (!(_transaction instanceof Transaction)) {
          throw new Error('PaymentGenericService.capture did not return Transaction instance')
        }
        return _transaction.save({transaction: options.transaction || null})
      })
      .then(_transaction => {
        resTransaction = _transaction
        // tslint:disable:max-line-length
        const event = {
          object_id: resTransaction.order_id,
          object: 'order',
          objects: [{
            order: resTransaction.order_id
          }, {
            transaction: resTransaction.id
          }],
          type: `order.transaction.capture.${resTransaction.status}`,
          message: `Order ID ${resTransaction.order_id} transaction capture of ${ this.app.services.ProxyCartService.formatCurrency(resTransaction.amount, resTransaction.currency)} ${resTransaction.currency} ${resTransaction.status}`,
          data: resTransaction
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        return resTransaction
      })
  }

  /**
   * Authorizes and Captures an amount
   * @param transaction
   * @param options
   * @returns {Promise.<T>}
   */
  sale(transaction, options) {
    options = options || {}
    transaction.description = transaction.description || 'Transaction Sale'

    const Transaction = this.app.models.Transaction
    const paymentProcessor = this.app.config.get(`generics.${transaction.gateway}`)
      || this.app.config.get('generics.payment_processor')

    if (!paymentProcessor || !paymentProcessor.adapter) {
      const err = new Error('Payment Processor is unspecified')
      return Promise.reject(err)
    }

    let resTransaction
    // Resolve the authorized transaction
    return Transaction.resolve(transaction, {transaction: options.transaction || null })
      .then(_transaction => {
        if (!(_transaction instanceof Transaction)) {
          throw new Error('Did not resolve a Transaction instance')
        }
        return this.app.services.PaymentGenericService.sale(_transaction, paymentProcessor)
      })
      .then(_transaction => {
        if (!(_transaction instanceof Transaction)) {
          throw new Error('PaymentGenericService.sale did not return Transaction instance')
        }
        return _transaction.save({transaction: options.transaction || null})
      })
      .then(_transaction => {
        resTransaction = _transaction
        // tslint:disable:max-line-length
        const event = {
          object_id: resTransaction.order_id,
          object: 'order',
          objects: [{
            order: resTransaction.order_id
          }, {
            transaction: resTransaction.id
          }],
          type: `order.transaction.sale.${resTransaction.status}`,
          message: `Order ID ${resTransaction.order_id} transaction sale of ${ this.app.services.ProxyCartService.formatCurrency(resTransaction.amount, resTransaction.currency)} ${resTransaction.currency} ${resTransaction.status}`,
          data: resTransaction
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        return resTransaction
      })
  }

  /**
   * Returns a pending transaction (No 3rd party Transaction Created Yet)
   * @param transaction
   * @param options
   * @returns {Promise.<T>}
   */
  manual(transaction, options) {
    options = options || {}

    const Transaction = this.app.models.Transaction

    if (!(transaction instanceof Transaction)) {
      throw new Error('Transaction must be an instance')
    }

    transaction.status = TRANSACTION_STATUS.PENDING

    return transaction.save({transaction: options.transaction || null})
      .then(() => {

        // tslint:disable:max-line-length
        const event = {
          object_id: transaction.order_id,
          object: 'order',
          objects: [{
            order: transaction.order_id
          }, {
            transaction: transaction.id
          }],
          type: `order.transaction.${transaction.kind}.${transaction.status}`,
          message: `Order ID ${transaction.order_id} transaction ID ${ transaction.id } ${transaction.kind} of ${ this.app.services.ProxyCartService.formatCurrency(transaction.amount, transaction.currency)} ${transaction.currency} ${transaction.status}`,
          data: transaction
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        return transaction
      })
  }

  /**
   *
   * @param transaction
   * @param options
   * @returns {Promise.<T>}
   */
  void(transaction, options: {[key: string]: any} = {}) {
    const Transaction = this.app.models['Transaction']
    const paymentProcessor = this.app.config.get(`generics.${transaction.gateway}`)
      || this.app.config.get('generics.payment_processor')

    if (!paymentProcessor || !paymentProcessor.adapter) {
      const err = new Error('Payment Processor is unspecified')
      return Promise.reject(err)
    }

    transaction.description = transaction.description || 'Transaction Void'

    let resTransaction
    return Transaction.resolve(transaction, {transaction: options.transaction || null })
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction Not Found')
        }
        if (!(_transaction instanceof Transaction)) {
          throw new Error('Did not resolve a Transaction instance')
        }
        if (_transaction.kind !== TRANSACTION_KIND.AUTHORIZE) {
          throw new Error(`Transaction kind must be '${TRANSACTION_KIND.AUTHORIZE}' to be voided`)
        }
        if (_transaction.status !== TRANSACTION_STATUS.SUCCESS) {
          throw new Error(`Transaction status must be '${TRANSACTION_STATUS.SUCCESS}' to be voided`)
        }
        return this.app.services.PaymentGenericService.void(_transaction, paymentProcessor)
      })
      .then(_transaction => {
        if (!(_transaction instanceof Transaction)) {
          throw new Error('PaymentGenericService.void did not return Transaction instance')
        }
        return _transaction.save({transaction: options.transaction || null})
      })
      .then(_transaction => {
        resTransaction = _transaction
        // tslint:disable:max-line-length
        const event = {
          object_id: resTransaction.order_id,
          object: 'order',
          objects: [{
            order: resTransaction.order_id
          }, {
            transaction: resTransaction.id
          }],
          type: `order.transaction.void.${resTransaction.status}`,
          message: `Order ID ${resTransaction.order_id} transaction ID ${ resTransaction.id } voided of ${ this.app.services.ProxyCartService.formatCurrency(resTransaction.amount, resTransaction.currency)} ${resTransaction.currency} ${resTransaction.status}`,
          data: resTransaction
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        return resTransaction
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
    const paymentProcessor = this.app.config.get(`generics.${transaction.gateway}`)
      || this.app.config.get('generics.payment_processor')

    if (!paymentProcessor || !paymentProcessor.adapter) {
      // TODO throw proper error
      const err = new Error('Payment Processor is unspecified')
      return Promise.reject(err)
    }

    transaction.description = transaction.description || 'Transaction Refund'

    let resTransaction
    return Transaction.resolve(transaction, {transaction: options.transaction || null })
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction Not Found')
        }

        if (!(_transaction instanceof Transaction)) {
          throw new Error('Did not resolve a Transaction instance')
        }

        if ([TRANSACTION_KIND.CAPTURE, TRANSACTION_KIND.SALE].indexOf(_transaction.kind) === -1) {
          throw new Error(`Transaction kind must be '${TRANSACTION_KIND.CAPTURE}' or '${TRANSACTION_KIND.SALE}' to be refunded`)
        }
        if (_transaction.status !== TRANSACTION_STATUS.SUCCESS) {
          throw new Error(`Transaction status must be '${TRANSACTION_STATUS.SUCCESS}' to be refunded`)
        }
        return this.app.services.PaymentGenericService.refund(_transaction, paymentProcessor)
      })
      .then(_transaction => {
        if (!(_transaction instanceof Transaction)) {
          throw new Error('PaymentGenericService.refund did not return Transaction instance')
        }
        return _transaction.save({transaction: options.transaction || null})
      })
      .then(_transaction => {
        resTransaction = _transaction
        // tslint:disable:max-line-length
        const event = {
          object_id: resTransaction.order_id,
          object: 'order',
          objects: [{
            order: resTransaction.order_id
          }, {
            transaction: resTransaction.id
          }],
          type: `order.transaction.refund.${resTransaction.status}`,
          message: `Order ID ${resTransaction.order_id} transaction ID ${ resTransaction.id } refund of ${ this.app.services.ProxyCartService.formatCurrency(resTransaction.amount, resTransaction.currency)} ${resTransaction.currency} ${resTransaction.status}`,
          data: resTransaction
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        return resTransaction
      })
  }

  /**
   *
   * @param transaction
   * @param options
   * @returns {Promise.<T>}
   */
  retry(transaction, options) {
    options = options || {}
    const Transaction = this.app.models['Transaction']
    let resTransaction
    return Transaction.resolve(transaction, {transaction: options.transaction || null })
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction Not Found')
        }
        if (!(_transaction instanceof Transaction)) {
          throw new Error('Did not resolve a Transaction instance')
        }
        if ([TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.FAILURE].indexOf(_transaction.status) === -1) {
          throw new Error('Transaction can not be tried if it is not pending or has not failed')
        }
        const paymentProcessor = this.app.config.get(`generics.${_transaction.gateway}`)
          || this.app.config.get('generics.payment_processor')

        if (!paymentProcessor || !paymentProcessor.adapter) {
          throw new Error('Payment Processor is unspecified')
        }

        _transaction.retry()
        return this.app.services.PaymentGenericService[_transaction.kind](_transaction, paymentProcessor)
      })
      .then(_transaction => {
        if (!(_transaction instanceof Transaction)) {
          throw new Error('PaymentGenericService.retry did not return Transaction instance')
        }
        return _transaction.save({transaction: options.transaction || null})
      })
      .then(_transaction => {
        resTransaction = _transaction
        const event = {
          object_id: resTransaction.order_id,
          object: 'order',
          objects: [{
            order: resTransaction.order_id
          }, {
            transaction: resTransaction.id
          }],
          type: `order.transaction.${resTransaction.kind}.${resTransaction.status}`,
          message: `Order ID ${resTransaction.order_id} transaction ID ${ resTransaction.id } ${resTransaction.kind} of ${ this.app.services.ProxyCartService.formatCurrency(resTransaction.amount, resTransaction.currency)} ${resTransaction.currency} ${resTransaction.status}`,
          data: resTransaction
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        return resTransaction
      })
  }

  /**
   *
   * @param transaction
   * @param options
   * @returns {Promise.<T>}
   */
  cancel(transaction, options) {
    options = options || {}
    const Transaction = this.app.models['Transaction']
    let resTransaction
    return Transaction.resolve(transaction, {transaction: options.transaction || null })
      .then(_transaction => {
        if (!_transaction) {
          throw new ModelError('E_NOT_FOUND', 'Transaction Not Found')
        }
        if (!(_transaction instanceof Transaction)) {
          throw new Error('Did not resolve Transaction instance')
        }
        if ([TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.FAILURE].indexOf(_transaction.status) === -1) {
          throw new Error('Transaction can not be cancelled if it is not pending or failed')
        }

        return _transaction.cancel().save({transaction: options.transaction || null})
      })
      .then(_transaction => {
        if (!(_transaction instanceof Transaction)) {
          throw new Error('Did not return Transaction instance')
        }
        resTransaction = _transaction
        // tslint:disable:max-line-length
        const event = {
          object_id: resTransaction.order_id,
          object: 'order',
          objects: [{
            order: resTransaction.order_id
          }, {
            transaction: resTransaction.id
          }],
          type: 'order.transaction.cancelled',
          message: `Order ID ${resTransaction.order_id} transaction ID ${ resTransaction.id } of ${ this.app.services.ProxyCartService.formatCurrency(resTransaction.amount, resTransaction.currency)} ${resTransaction.status}`,
          data: resTransaction
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        return resTransaction
      })
  }
}
