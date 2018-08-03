import * as joi from 'joi'
import { collection } from '../schemas/collection'

export const validateCollection = {
  // Validate Collection Create
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, collection, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Collection Update
  update(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, collection, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
