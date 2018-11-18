/**
 * Module dependencies.
 */
import * as http from 'http'
import { initialize } from '../middleware/initialize'
import { authenticate } from '../middleware/authenticate'
import { req as IncomingMessageExt } from '../http/request'

/**
 * Framework support for Connect/Express.
 *
 * This module provides support for using Passport with Express.  It exposes
 * middleware that conform to the `fn(req, res, next)` signature and extends
 * Node's built-in HTTP request object with useful cart-related
 * functions.
 *
 * @return {Object}
 * @api protected
 */
exports = module.exports = function() {

  // HTTP extensions.
  exports.__monkeypatchNode()

  return {
    initialize: initialize,
    authenticate: authenticate
  }
}

exports.__monkeypatchNode = function() {
  // const http = require('http')
  // const IncomingMessageExt = require('../http/request')

  http.IncomingMessage.prototype['loginCart'] =
    http.IncomingMessage.prototype['logInCart'] = IncomingMessageExt.logInCart

  http.IncomingMessage.prototype['loginCustomer'] =
    http.IncomingMessage.prototype['logInCustomer'] = IncomingMessageExt.logInCustomer

  http.IncomingMessage.prototype['loginShop'] =
    http.IncomingMessage.prototype['logInShop'] = IncomingMessageExt.logInShop

  http.IncomingMessage.prototype['logoutCart'] =
    http.IncomingMessage.prototype['logOutCart'] = IncomingMessageExt.logOutCart
  http.IncomingMessage.prototype['logoutCustomer'] =
    http.IncomingMessage.prototype['logOutCustomer'] = IncomingMessageExt.logOutCustomer
  http.IncomingMessage.prototype['logoutShop'] =
    http.IncomingMessage.prototype['logOutShop'] = IncomingMessageExt.logOutShop

  http.IncomingMessage.prototype['hasCart'] = IncomingMessageExt.hasCart
  http.IncomingMessage.prototype['hasNoCart'] = IncomingMessageExt.hasNoCart

  http.IncomingMessage.prototype['hasCustomer'] = IncomingMessageExt.hasCustomer
  http.IncomingMessage.prototype['hasNoCustomer'] = IncomingMessageExt.hasNoCustomer

  http.IncomingMessage.prototype['hasShop'] = IncomingMessageExt.hasShop
  http.IncomingMessage.prototype['hasNoShop'] = IncomingMessageExt.hasNoShop
}
