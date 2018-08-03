'use strict'
// const _ = require('lodash')
const Generic = require('@fabrix/spool-generics').Generic
module.exports = class FakeGeolocationProvider { // extends Generic{
  constructor(config) {
    // super()
    this.config = config
  }

  locate(data) {
    return Promise.resolve({
      latitude: 0.000000,
      longitude: 0.000000
    })
  }
}
