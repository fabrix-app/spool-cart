

import * as joi from 'joi'
import * as Schemas from '../schemas'



export const validateStores = {
  // Validate Database Config
  config(config) {
    return new Promise((resolve, reject) => {
      joi.validate(config, Schemas.storesConfig, (err, value) => {
        if (err) {
          return reject(new TypeError('config.database: ' + err))
        }
        return resolve(value)
      })
    })
  }
}
