import * as joi from 'joi'
import { customer, accountBalance } from '../schemas/customer'

export const validateCustomer = {
  // Validate Create Customer
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, customer, (err, value) => {
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
      joi.validate(data, customer, (err, value) => {
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
      joi.validate(data, accountBalance, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
