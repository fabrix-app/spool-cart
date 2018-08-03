'use strict'
/* global describe, it */
const assert = require('assert')

describe('Source Model', () => {
  let Source
  it('should exist', () => {
    assert(global.app.api.models['Source'])
    Source = global.app.models['Source']
  })
  it('should resolve a source instance', (done) => {
    Source.resolve(Source.build({}))
      .then(source => {
        assert.ok(source instanceof Source.instance)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
