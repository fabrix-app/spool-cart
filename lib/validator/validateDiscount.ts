

import * as joi from 'joi'
import * as Schemas from '../schemas'


export const validateDiscount = {
  // Validate Create Discount
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.discount.create, (err, value) => {
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
      joi.validate(data, Schemas.discount.update, (err, value) => {
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
      joi.validate(data, Schemas.discount.destroy, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
