

import * as joi from 'joi'
import * as Schemas from '../schemas'


export const validateCart = {
  // Validate Creating a cart
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.cart.cart, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Updating a cart
  update(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.cart.cart, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Cart Checkout
  checkout(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.cart.checkout, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Items to add to cart
  addItems(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.cart.addItems, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Items to update in cart
  updateItems(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.cart.updateItems, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Items to remove from cart
  removeItems(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.cart.removeItems, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  addShipping(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.cart.addShipping, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  removeShipping(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.cart.removeShipping, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  addTaxes(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.cart.addTaxes, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  removeTaxes(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.cart.removeTaxes, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Clearing all items from the cart
  clear(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.cart.clear, (err, value) => {
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
      joi.validate(data, Schemas.cart.pricingOverrides, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
