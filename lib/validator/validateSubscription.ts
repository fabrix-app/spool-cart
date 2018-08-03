import * as joi from 'joi'
import {
  subscription,
  cancel,
  activate,
  deactivate,
  addItems,
  removeItems
} from '../schemas/subscription'

export const validateSubscription = {
  // Validate Creating a subscription
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, subscription, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Update Subscription
  update(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, subscription, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Cancelling a subscription
  cancel(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, cancel, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate activating a subscription
  activate(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, activate, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate activating a subscription
  deactivate(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, deactivate, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Items to add to subscription
  addItems(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, addItems, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Items to remove from subscription
  removeItems(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, removeItems, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
