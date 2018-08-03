import * as joi from 'joi'
import { create, update, destroy } from '../schemas/discount'

export const validateDiscount = {
  // Validate Create Discount
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, create, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate update discount
  update(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, update, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate destroy discount
  destroy(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, destroy, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
