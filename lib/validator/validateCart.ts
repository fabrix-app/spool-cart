import * as joi from 'joi'
import {
  cart,
  checkout,
  addItems,
  removeItems,
  updateItems,
  addTaxes,
  removeTaxes,
  addShipping,
  removeShipping,
  pricingOverrides,
  clear
} from '../schemas/cart'


export const validateCart = {
  // Validate Creating a cart
  create(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, cart, (err, value) => {
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
      joi.validate(data, cart, (err, value) => {
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
      joi.validate(data, checkout, (err, value) => {
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
      joi.validate(data, addItems, (err, value) => {
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
      joi.validate(data, updateItems, (err, value) => {
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
      joi.validate(data, removeItems, (err, value) => {
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
  // Validate Clearing all items from the cart
  clear(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, clear, (err, value) => {
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
