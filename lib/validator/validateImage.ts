import * as joi from 'joi'
import { image, removeImages } from '../schemas/product'

export const validateImage = {
  // Validate remove Product Image
  remove(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, image, (err, value) => {
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
      joi.validate(data, removeImages, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
