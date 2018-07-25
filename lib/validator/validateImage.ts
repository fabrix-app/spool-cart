

import * as joi from 'joi'
import * as Schemas from '../schemas'


export const validateImage = {
  // Validate remove Product Image
  remove(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.product.image, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate remove Product Images
  removeImages(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.product.removeImages, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
