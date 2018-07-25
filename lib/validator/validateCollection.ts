

import * as joi from 'joi'
import * as Schemas from '../schemas'


export const validateCollection = {
  // Validate Collection Create
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.collection.collection, (err, value) => {
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
      joi.validate(data, Schemas.collection.collection, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
