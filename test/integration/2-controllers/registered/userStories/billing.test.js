'use strict'
/* global describe, it */
const assert = require('assert')
const supertest = require('supertest')
const _ = require('lodash')

describe('Registered User Billing Actions', () => {
  let registeredUser, userID, customerID, accountToken, sourceToken

  before((done) => {

    registeredUser = supertest.agent(global.app.spools.express.server)

    registeredUser.post('/auth/local/register')
      .send({
        email: 'billing@example.com',
        password: 'admin1234'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        assert.ok(res.body.user.id)
        assert.ok(res.body.user.current_customer_id)
        userID = res.body.user.id
        customerID = res.body.user.current_customer_id
        done(err)
      })
  })

  it('should get customer accounts', done => {
    registeredUser
      .get('/customer/accounts')
      .expect(200)
      .end((err, res) => {
        assert.ok(res.headers['x-pagination-total'])
        assert.ok(res.headers['x-pagination-pages'])
        assert.ok(res.headers['x-pagination-page'])
        assert.ok(res.headers['x-pagination-limit'])
        assert.ok(res.headers['x-pagination-offset'])

        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-total'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-offset'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-limit'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-page'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-pages'])), true)
        done(err)
      })
  })

  it('should add customer source', done => {
    registeredUser
      .post('/customer/source')
      .send({
        source: {
          gateway: 'payment_processor',
          gateway_token: 'abc123'
        }
      })
      .expect(200)
      .end((err, res) => {

        // console.log('BROKE SOURCE', res.body)

        sourceToken = res.body.token
        // accountToken = res.body.account_id
        // assert.equal(res.body.customer_id, createdCustomerID)
        assert.equal(res.body.gateway, 'payment_processor')
        assert.ok(res.body.account_foreign_key)
        assert.ok(res.body.account_foreign_id)
        assert.ok(res.body.account_foreign_key)
        assert.ok(res.body.payment_details)
        assert.ok(res.body.account_id)
        assert.ok(res.body.is_default)

        done(err)
      })
  })
  it('should update customer source', done => {
    registeredUser
      .put(`/customer/source/${ sourceToken }`)
      .send({
        source: {
          gateway: 'payment_processor',
          exp_month: '12',
          exp_year: '2018'
        }
      })
      .expect(200)
      .end((err, res) => {
        // console.log('BROKE SOURCE', res.body)
        // assert.equal(res.body.customer_id, createdCustomerID)
        assert.equal(res.body.token, sourceToken)
        // assert.equal(res.body.account_id, accountToken)
        assert.equal(res.body.gateway, 'payment_processor')
        assert.ok(res.body.account_foreign_key)
        assert.ok(res.body.account_foreign_id)
        assert.ok(res.body.account_foreign_key)
        assert.ok(res.body.payment_details)
        assert.ok(res.body.is_default)
        done(err)
      })
  })
  it('should get customer sources', done => {
    registeredUser
      .get('/customer/sources')
      .expect(200)
      .end((err, res) => {
        assert.ok(res.headers['x-pagination-total'])
        assert.ok(res.headers['x-pagination-pages'])
        assert.ok(res.headers['x-pagination-page'])
        assert.ok(res.headers['x-pagination-limit'])
        assert.ok(res.headers['x-pagination-offset'])

        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-total'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-offset'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-limit'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-page'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-pages'])), true)
        done(err)
      })
  })
  it('should remove customer source', done => {
    registeredUser
      .delete(`/customer/source/${ sourceToken }`)
      .expect(200)
      .end((err, res) => {
        // assert.equal(res.body.customer_id, createdCustomerID)
        assert.equal(res.body.token, sourceToken)
        // assert.equal(res.body.account_id, accountToken)
        assert.equal(res.body.gateway, 'payment_processor')
        assert.ok(res.body.account_foreign_key)
        assert.ok(res.body.account_foreign_id)
        assert.ok(res.body.account_foreign_key)
        assert.ok(res.body.payment_details)
        assert.ok(res.body.is_default)
        done(err)
      })
  })
})
