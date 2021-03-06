'use strict'
/* global describe, it */
const assert = require('assert')

describe('Fulfillment Model', () => {
  let Fulfillment
  it('should exist', () => {
    assert(global.app.api.models['Fulfillment'])
    Fulfillment = global.app.models['Fulfillment']
  })
  it('should resolve a fulfillment instance', (done) => {
    Fulfillment.resolve(Fulfillment.build({}))
      .then(fulfillment => {
        assert.ok(fulfillment instanceof Fulfillment.instance)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
