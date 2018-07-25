

import * as joi from 'joi'
import * as Schemas from '../schemas'


export const validateCustomer = {
  // Validate Create Customer
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.customer.customer, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Update Customer
  update(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.customer.customer, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Customer Account Balance
  accountBalance(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.customer.accountBalance, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
