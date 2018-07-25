

import * as joi from 'joi'
import * as Schemas from '../schemas'


export const validateShop = {
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.shop.shop, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
