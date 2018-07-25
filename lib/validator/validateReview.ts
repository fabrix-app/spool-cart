

import * as joi from 'joi'
import * as Schemas from '../schemas'


export const validateReview = {
  // Validate Create Review
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.review.review, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Update Review
  update(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.review.review, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Destroy Review
  destroy(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.review.review, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
