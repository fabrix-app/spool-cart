'use strict'
/* global describe, it */
const assert = require('assert')
const supertest = require('supertest')
const _ = require('lodash')

describe('Admin User ShopController', () => {
  let adminUser, userID, customerID, shopID

  before((done) => {

    adminUser = supertest.agent(global.app.spools.express.server)
    // Login as Admin
    adminUser
      .post('/auth/local')
      .set('Accept', 'application/json') //set header for this test
      .send({username: 'admin', password: 'admin1234'})
      .expect(200)
      .end((err, res) => {
        assert.ok(res.body.user.id)
        assert.ok(res.body.user.current_customer_id)
        userID = res.body.user.id
        customerID = res.body.user.current_customer_id
        shopID = res.body.user.shop_id
        done(err)
      })
  })
  it('should exist', () => {
    assert(global.app.api.controllers['ShopController'])
  })
  // TODO complete test
  it('should get general stats', (done) => {
    adminUser
      .get('/shop/generalStats')
      .expect(200)
      .end((err, res) => {
        assert.ok(res.body)
        done(err)
      })
  })
  it('should make addShop post adminUser', (done) => {
    adminUser
      .post('/shop')
      .send(
        {
          handle: 'shoppie',
          name: 'Shoppie',
          host: 'test.com',
        }
      )
      .expect(200)
      .end((err, res) => {
        // Shop
        assert.ok(res.body.id)
        assert.equal(res.body.handle, 'shoppie')
        assert.equal(res.body.name, 'Shoppie')
        assert.equal(res.body.host, 'test.com')

        done(err)
      })
  })
  it('should count all shops', (done) => {
    adminUser
      .get('/shop/count')
      .expect(200)
      .end((err, res) => {
        assert.ok(_.isNumber(res.body.shops))
        done(err)
      })
  })
  it('It should get shops', (done) => {
    adminUser
      .get('/shops')
      .expect(200)
      .end((err, res) => {
        assert.ok(res.headers['x-pagination-total'])
        assert.ok(res.headers['x-pagination-pages'])
        assert.ok(res.headers['x-pagination-page'])
        assert.ok(res.headers['x-pagination-limit'])
        assert.ok(res.headers['x-pagination-offset'])
        assert.ok(res.headers['x-pagination-sort'])

        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-total'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-offset'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-limit'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-page'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-pages'])), true)

        assert.ok(res.body)
        done(err)
      })
  })

  // This request is already logged into shop, but just to prove they can
  it('should login to shop', done => {
    adminUser
      .post(`/shop/1/login`)
      .send({ })
      .expect(200)
      .end((err, res) => {
        // console.log('BROKE', err, res.body)
        assert.ok(res.body.id)
        assert.equal(res.body.id, 1)
        done(err)
      })
  })

  it('should have user current_shop_id set to 1', (done) => {
    adminUser
      .get(`/user/${ userID }`)
      .expect(200)
      .end((err, res) => {
        console.log('BRK 1', res.body)
        assert.ok(res.body)
        assert.equal(res.body.current_shop_id, 1)
        done(err)
      })
  })

  it('should switch shop', done => {
    adminUser
      .post(`/shop/2/switch`)
      .send({ })
      .expect(200)
      .end((err, res) => {
        // console.log('BROKE2', err, res.body)
        assert.ok(res.body.id)
        assert.equal(res.body.id, 2)
        done(err)
      })
  })

  it('should have user current_shop_id set to 2', (done) => {
    adminUser
      .get(`/user/${ userID }`)
      .expect(200)
      .end((err, res) => {
        assert.ok(res.body)
        assert.equal(res.body.current_shop_id, 2)
        done(err)
      })
  })

  it('should switch back to shop', done => {
    adminUser
      .post(`/shop/1/switch`)
      .send({ })
      .expect(200)
      .end((err, res) => {
        assert.ok(res.body.id)
        assert.equal(res.body.id, 1)
        done(err)
      })
  })

  it('should have user current_shop_id set back to 1', (done) => {
    adminUser
      .get(`/user/${ userID }`)
      .expect(200)
      .end((err, res) => {
        assert.ok(res.body)
        assert.equal(res.body.current_shop_id, 1)
        done(err)
      })
  })

  it('should logout of shop', done => {
    adminUser
      .post(`/shop/2/logout`)
      .send({ })
      .expect(200)
      .end((err, res) => {
        done(err)
      })
  })

  it('should have user current_shop_id set to null', (done) => {
    adminUser
      .get(`/user/${ userID }`)
      .expect(200)
      .end((err, res) => {
        assert.ok(res.body)
        assert.equal(res.body.current_shop_id, null)
        done(err)
      })
  })
})
