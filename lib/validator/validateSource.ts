

import * as joi from 'joi'
import * as Schemas from '../schemas'


export const validateSource = {
  // Validate Add Source
  add(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.source.source, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Update Source
  update(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.source.source, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Remove Source
  remove(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.source.source, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
