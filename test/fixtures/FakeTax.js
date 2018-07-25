'use strict'
// const _ = require('lodash')
const Generic = require('spool-generics').Generic
module.exports = class FakeTaxProvider extends Generic {
  constructor(options) {
    super()
    this.options = options
  }
}
