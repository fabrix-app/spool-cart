/**
 * Module dependencies.
 */
// const http = require('http')
// const IncomingMessageExt = require('../http/request')
// import { __monkeypatchNode } from '../framework/connect'

export const authenticate = function(cart, options, callback) {

  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  options = options || {}

  return function auth(req, res, next) {
    // if (
    //   http.IncomingMessage.prototype.logInCart
    //   && http.IncomingMessage.prototype.logInCart !== IncomingMessageExt.logInCart
    //   && http.IncomingMessage.prototype.logInCustomer
    //   && http.IncomingMessage.prototype.logInCustomer !== IncomingMessageExt.logInCustomer
    // ) {
    require('../framework/connect').__monkeypatchNode()
    // __monkeypatchNode()
    // }

    if (!req._cart) {
      return this.error(new Error('cart.initialize() middleware not in use'))
    }

    next()
  }
}
