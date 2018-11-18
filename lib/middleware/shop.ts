// tslint:disable:no-shadowed-variable

/**
 * Module dependencies.
 */
// const http = require('http')
// const IncomingMessageExt = require('../http/request')

export const shop = function(cart, options, callback) {

  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  options = options || {}

  return function shop(req, res, next) {
    if (!req._cart) {
      return this.error(new Error('cart.initialize() middleware not in use'))
    }

    if (req.session && req.session[req._cart.instance._key]) {
      const property = req._cart.instance._shopProperty || 'shop'
      const shopS = req.session[req._cart.instance._key][property]
      if (shopS) {
        req._cart.instance.deserializeShop(shopS, req, (err, shop) => {
          if (err) {
            return next(err)
          }
          if (!shop) {
            delete req._cart.session[property]
          }
          else {
            req[property] = shop
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
