'use strict'
// const _ = require('lodash')
const Generic = require('@fabrix/spool-generics').Generic
module.exports = class FakeShippingProvider { // extends Generic{
  constructor(config) {
    // super()
    this.config = config
  }
  validateAddress(data) {
    return Promise.resolve(data)
  }
  getRate(data) {
    return Promise.resolve({})
  }
  getRates(data) {
    return Promise.resolve([])
  }
}
