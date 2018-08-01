

import * as joi from 'joi'
import * as Schemas from '../schemas'


export const validateProduct = {
  // Validate Add Product
  add(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, Schemas.product.product, (err, value) => {
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
      joi.validate(data, Schemas.product.add, (err, value) => {
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
      joi.validate(data, Schemas.product.add, (err, value) => {
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
      joi.validate(data, Schemas.product.product, (err, value) => {
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
      joi.validate(data, Schemas.product.update, (err, value) => {
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
      joi.validate(data, Schemas.product.product, (err, value) => {
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
      joi.validate(data, Schemas.product.product, (err, value) => {
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
      joi.validate(data, Schemas.product.remove, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
