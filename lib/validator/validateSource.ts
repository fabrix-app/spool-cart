import * as joi from 'joi'
import { source } from '../schemas/source'

export const validateSource = {
  // Validate Add Source
  add(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, source, (err, value) => {
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
      joi.validate(data, source, (err, value) => {
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
      joi.validate(data, source, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
