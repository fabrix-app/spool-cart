

import * as joi from 'joi'
import * as Schemas from '../schemas'

export const validateCartSpool = {
  config(config) {
    return new Promise((resolve, reject) => {
      joi.validate(config, Schemas.cartSpoolConfig, (err, value) => {
        if (err) {
          return reject(new TypeError('config.cart: ' + err))
        }
        return resolve(value)
      })
    })
  }
}
