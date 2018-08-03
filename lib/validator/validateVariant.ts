import * as joi from 'joi'
import { variant, removeVariants } from '../schemas/product'

export const validateVariant = {
  // Validate Create Variant
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, variant, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Update Variant
  update(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, variant, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Remove Product Variant
  remove(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, variant, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Remove Product Variants
  removeVariants(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, removeVariants, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
