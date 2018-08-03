'use strict'
/* global describe, it */
const assert = require('assert')

describe('Cart Model', () => {
  let Cart, Discount
  it('should exist', () => {
    assert(global.app.api.models['Cart'])
    assert(global.app.models['Cart'])
    Cart = global.app.models['Cart']
    Discount = global.app.models['Discount']
    assert(Cart)
  })
  describe('# Discounts', () => {
    it('should add normal discounted lines to cart items', (done) => {
      let cart = Cart.build({
        line_items: [{
          product_id: 1,
          type: 'product',
          price: 1000
        }, {
          product_id: 2,
          type: 'product',
          price: 1000
        }]
      })
      const discount1 = Discount.build({
        id: 1,
        handle: 'test-1',
        name: 'test 1',
        description: 'test 1',
        code: 'test_123-1',
        discount_type: 'rate',
        discount_rate: 100,
        discount_scope: 'global',
        status: 'enabled'
      })
      const discount2 = Discount.build({
        id: 2,
        handle: 'test-2',
        name: 'test 2',
        description: 'test 2',
        code: 'test_123-2',
        discount_type: 'rate',
        discount_rate: 100,
        discount_scope: 'global',
        status: 'enabled'
      })
      cart = cart.setItemsDiscountedLines([discount1, discount2])
      assert.equal(cart.total_discounts, 400)
      assert.equal(cart.discounted_lines.length, 2)
      assert.equal(cart.discounted_lines[0].price, 200)
      assert.equal(cart.discounted_lines[1].price, 200)
      assert.equal(cart.line_items.length, 2)
      assert.equal(cart.line_items[0].price, 1000)
      assert.equal(cart.line_items[0].calculated_price, 800)
      assert.equal(cart.line_items[1].price, 1000)
      assert.equal(cart.line_items[1].calculated_price, 800)
      done()
    })

    it('should add discounted lines only once to cart items', (done) => {
      let cart = Cart.build({
        line_items: [{
          product_id: 1,
          type: 'product',
          price: 1000
        }, {
          product_id: 2,
          type: 'product',
          price: 1000
        }]
      })
      const discount1 = Discount.build({
        id: 1,
        handle: 'test-1',
        name: 'test 1',
        description: 'test 1',
        code: 'test_123-1',
        discount_type: 'rate',
        discount_rate: 100,
        discount_scope: 'global',
        applies_once: true,
        status: 'enabled'
      })
      cart = cart.setItemsDiscountedLines([discount1])
      // console.log('BUILT',cart.toJSON().discounted_lines)
      // console.log('BUILT',cart.toJSON().line_items)
      assert.equal(cart.total_discounts, 100)
      assert.equal(cart.discounted_lines.length, 1)
      assert.equal(cart.line_items.length, 2)
      assert.equal(cart.line_items[0].price, 1000)
      assert.equal(cart.line_items[0].calculated_price, 1000)
      assert.equal(cart.line_items[1].price, 1000)
      assert.equal(cart.line_items[1].calculated_price, 900)
      done()
    })

    it('should not discount an item more than it\'s price', (done) => {
      let cart = Cart.build({
        line_items: [{
          product_id: 1,
          type: 'product',
          price: 1000
        }]
      })
      const discount1 = Discount.build({
        id: 1,
        handle: 'test-1',
        name: 'test 1',
        description: 'test 1',
        code: 'test_123-1',
        discount_type: 'rate',
        discount_rate: 10000,
        discount_scope: 'global',
        applies_once: false,
        status: 'enabled'
      })
      const discount2 = Discount.build({
        id: 2,
        handle: 'test-2',
        name: 'test 2',
        description: 'test 2',
        code: 'test_123-2',
        discount_type: 'rate',
        discount_rate: 10000,
        discount_scope: 'global',
        applies_once: false,
        status: 'enabled'
      })
      cart = cart.setItemsDiscountedLines([discount1, discount2])
      // console.log('BUILT',cart.toJSON().discounted_lines)
      // console.log('BUILT',cart.toJSON().line_items)
      assert.equal(cart.total_discounts, 1000)
      assert.equal(cart.discounted_lines.length, 2)
      assert.equal(cart.line_items.length, 1)
      assert.equal(cart.line_items[0].calculated_price, 0)
      assert.equal(cart.line_items[0].total_discounts, 1000)
      assert.equal(cart.line_items[0].price, 1000)
      done()
    })
  })

  describe('# Resolvers', () => {
    it('should resolve a cart instance', (done) => {
      Cart.resolve(Cart.build({}))
        .then(cart => {
          assert.ok(cart instanceof Cart.instance)
          done()
        })
        .catch(err => {
          done(err)
        })
    })

    it('should resolve a cart by token', (done) => {
      let resCart
      Cart.create({})
        .then(cart => {
          assert.ok(cart instanceof Cart.instance)
          resCart = cart
          return Cart.resolve({token: resCart.token})
        })
        .then(cart => {
          assert.ok(cart instanceof Cart.instance)
          assert.equal(cart.id, resCart.id)
          done()
        })
        .catch(err => {
          done(err)
        })
    })
    it('should resolve a cart by token string', (done) => {
      let resCart
      Cart.create({})
        .then(cart => {
          assert.ok(cart instanceof Cart.instance)
          resCart = cart
          return Cart.resolve(resCart.token)
        })
        .then(cart => {
          assert.ok(cart instanceof Cart.instance)
          assert.equal(cart.id, resCart.id)
          done()
        })
        .catch(err => {
          done(err)
        })
    })

    it('should resolve a cart by id', (done) => {
      let resCart
      Cart.create({})
        .then(cart => {
          assert.ok(cart instanceof Cart.instance)
          resCart = cart
          return Cart.resolve({id: resCart.id})
        })
        .then(cart => {
          assert.ok(cart instanceof Cart.instance)
          assert.equal(cart.id, resCart.id)
          done()
        })
        .catch(err => {
          done(err)
        })
    })
    it('should resolve a cart by id string', (done) => {
      let resCart
      Cart.create({})
        .then(cart => {
          assert.ok(cart instanceof Cart.instance)
          resCart = cart
          return Cart.resolve(resCart.id)
        })
        .then(cart => {
          assert.ok(cart instanceof Cart.instance)
          assert.equal(cart.id, resCart.id)
          done()
        })
        .catch(err => {
          done(err)
        })
    })
  })
})
