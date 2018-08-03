import * as joi from 'joi'
import {
  product,
  add as addP,
  update as updateP,
  remove as removeP
} from '../schemas/product'

export const validateProduct = {
  // Validate Add Product
  add(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, product, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Add Product
  addProduct(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, addP, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Add Products
  addProducts(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, addP, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Update Product
  update(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, product, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Update Products
  updateProducts(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, updateP, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Remove Product
  remove(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, product, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Remove Product
  removeProduct(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, product, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Remove Products
  removeProducts(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, removeP, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
