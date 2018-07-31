// tslint:disable:no-shadowed-variable
/**
 * Module dependencies.
 */
// const http = require('http')
// const IncomingMessageExt = require('../http/request')

export const cart = function(cart, options, callback) {

  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  options = options || {}

  return function cart(req, res, next) {
    if (!req._cart) {
      return this.error(new Error('cart.initialize() middleware not in use'))
    }

    if (req.session && req.session[req._cart.instance._key]) {
      const property = req._cart.instance._cartProperty || 'cart'
      const cartS = req.session[req._cart.instance._key][property]
      if (cartS) {
        req._cart.instance.deserializeCart(cartS, req, (err, cart) => {
          if (err) {
            return next(err)
          }
          if (!cart) {
            delete req._cart.session[property]
          }
          else {
            req[property] = cart
          }
          return next()
        })
      }
      else {
        return next()
      }
    }
    else {
      return next()
    }
  }
}
