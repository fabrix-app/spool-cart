'use strict'
/* global describe, it */
const assert = require('assert')

describe('CustomerCart Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['CustomerCart'])
  })
})
