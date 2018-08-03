'use strict'
/* global describe, it */
const assert = require('assert')

describe('ProductService', () => {
  let ProductService
  let Product
  let Variant
  it('should exist', () => {
    assert(global.app.api.services['ProductService'])
    ProductService = global.app.services['ProductService']
    Product = global.app.models['Product']
    Variant = global.app.models['ProductVariant']
  })
  it('should resolve a product instance', (done) => {
    Product.resolve(Product.build({}))
      .then(product => {
        assert.ok(product instanceof Product.instance)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('should resolve a variant instance', (done) => {
    Variant.resolve(Variant.build({}))
      .then(variant => {
        assert.ok(variant instanceof Variant.instance)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
