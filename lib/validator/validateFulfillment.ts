

import * as joi from 'joi'
import * as Schemas from '../schemas'


export const validateFulfillment = {
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.fulfillment.fulfillment, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  cancel(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.fulfillment.fulfillment, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  update(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.fulfillment.fulfillment, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  destroy(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.fulfillment.fulfillment, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
