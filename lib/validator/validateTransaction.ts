import * as joi from 'joi'
import * as Schemas from '../schemas'
import { transaction } from '../schemas/transaction'

export const validateTransaction = {
  // Validate Authorize Transaction
  authorize(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, transaction, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Capture Transaction
  capture(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, transaction, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Sale Transaction
  sale(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, transaction, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Void Transaction
  void(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, transaction, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Refund Transaction
  refund(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, transaction, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  retry(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, transaction, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  cancel(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, transaction, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
