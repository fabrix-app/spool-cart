'use strict'
/* global describe, it */
const assert = require('assert')
const moment = require('moment')

describe('TransactionService', () => {
  let TransactionService, Transaction, Order
  it('should exist', () => {
    assert(global.app.api.services['TransactionService'])
    TransactionService = global.app.services['TransactionService']
    Transaction = global.app.models['Transaction']
    Order = global.app.models['Order']
  })

  it('should retry transactions that failed payment', (done) => {
    let orderID
    const start = moment().startOf('hour').subtract(1,'hours')
    const transactionsToCreate = []

    Order.create({
      shop_id: 1,
      customer_id: 1,
      financial_status: 'pending'
    })
      .then(order => {
        orderID = order.id
        let i = 0
        while (i < 21) {
          transactionsToCreate.push({
            customer_id: order.customer_id,
            order_id: orderID,
            gateway: 'stripe',
            source_name: 'web',
            kind: 'sale',
            status: 'failure',
            error_code: 'processing_error',
            authorization: `transaction_${i}`,
            description: `transaction retry transaction_${i}`
          })
          i++
        }
        return Transaction.bulkCreate(transactionsToCreate)
      })
      .then(transactions => {
        return TransactionService.retryThisHour()
          .then(retries => {
            assert.equal(retries.transactions, 21)
            assert.equal(retries.errors.length, 0)
            return TransactionService.retryThisHour()
          })
      })
      .then(retries => {
        // Should be zero since they can't be retried more than once in the same hour.
        assert.equal(retries.transactions, 0)
        assert.equal(retries.errors.length, 0)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should cancel transactions that failed payment after retries', (done) => {
    let orderID
    const start = moment().startOf('hour').subtract(5, 'days')
    const transactionsToCreate = []

    Order.create({
      shop_id: 1,
      customer_id: 1,
      financial_status: 'pending'
    })
      .then(order => {
        orderID = order.id
        let i = 0
        while (i < 21) {
          transactionsToCreate.push({
            customer_id: order.customer_id,
            order_id: orderID,
            gateway: 'stripe',
            source_name: 'web',
            kind: 'sale',
            error_code: 'processing_error',
            status: 'failure',
            authorization: `transaction_${i}`,
            description: `transaction cancel transaction_${i}`,
            total_retry_attempts: 5,
            authorization_exp: start,
            retry_at: start
          })
          i++
        }
        return Transaction.bulkCreate(transactionsToCreate)
      })
      .then(transactions => {
        return TransactionService.cancelThisHour()
          .then(cancelled => {
            assert.equal(cancelled.transactions, 21)
            assert.equal(cancelled.errors.length, 0)
            return TransactionService.cancelThisHour()
          })
      })
      .then(cancelled => {
        // Should be zero since they can't be retried more than once in the same hour.
        assert.equal(cancelled.transactions, 0)
        assert.equal(cancelled.errors.length, 0)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
