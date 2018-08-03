import * as joi from 'joi'
import { address } from '../schemas/address'

export const validateAddress = {
  // Validate Add Address
  add(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, address, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Update Address
  update(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, address, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Remove Address
  remove(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, address, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
