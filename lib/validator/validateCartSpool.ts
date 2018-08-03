import * as joi from 'joi'
import { cartSpoolConfig } from '../schemas/cartSpoolConfig'

export const validateCartSpool = {
  config(config) {
    return new Promise((resolve, reject) => {
      joi.validate(config, cartSpoolConfig, (err, value) => {
        if (err) {
          return reject(new TypeError('config.cart: ' + err))
        }
        return resolve(value)
      })
    })
  }
}
