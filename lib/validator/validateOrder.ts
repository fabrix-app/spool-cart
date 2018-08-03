import * as joi from 'joi'

import {
  order,
  update,
  cancel,
  pay,
  refund,
  retry,
  authorize,
  capture,
  voidTransaction,
  addItem,
  addItems,
  updateItem,
  removeItem,
  addShipping,
  addTaxes,
  removeShipping,
  removeTaxes,
  pricingOverrides,
  send,
  fulfill
} from '../schemas/order'

export const validateOrder = {
  // Validate Order Create
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, order, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Order Update
  update(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, update, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Order Cancel
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
  // Validate Order Pay
  pay(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, pay, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Order Refund
  refund(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, refund, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Order Refund
  retry(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, retry, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Order transaction capture
  authorize(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, authorize, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Order transaction capture
  capture(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, capture, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Order transaction void
  void(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, voidTransaction, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  addItem(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, addItem, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
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
  updateItem(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, updateItem, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  removeItem(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, removeItem, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  addShipping(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, addShipping, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  removeShipping(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, removeShipping, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  addTaxes(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, addTaxes, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  removeTaxes(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, removeTaxes, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  fulfill(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, fulfill, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  send(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, send, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Pricing Overrides
  pricingOverrides(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, pricingOverrides, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
