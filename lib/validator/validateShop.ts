import * as joi from 'joi'
import { shop } from '../schemas/shop'

export const validateShop = {
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, shop, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
