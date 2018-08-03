import * as joi from 'joi'
import { storeConfig } from '../schemas'

export const validateStores = {
  // Validate Database Config
  config(config) {
    return new Promise((resolve, reject) => {
      joi.validate(config, storeConfig, (err, value) => {
        if (err) {
          return reject(new TypeError('config.database: ' + err))
        }
        return resolve(value)
      })
    })
  }
}
