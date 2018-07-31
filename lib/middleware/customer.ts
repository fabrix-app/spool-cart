// tslint:disable:no-shadowed-variable

/**
 * Module dependencies.
 */
// const http = require('http')
// const IncomingMessageExt = require('../http/request')

export const customer = function(cart, options, callback) {

  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  options = options || {}

  return function customer(req, res, next) {
    if (!req._cart) {
      return this.error(new Error('cart.initialize() middleware not in use'))
    }

    if (req.session && req.session[req._cart.instance._key]) {
      const property = req._cart.instance._customerProperty || 'customer'
      const customerS = req.session[req._cart.instance._key][property]
      if (customerS) {
        req._cart.instance.deserializeCustomer(customerS, req, (err, customer) => {
          if (err) {
            return next(err)
          }
          if (!customer) {
            delete req._cart.session[property]
          }
          else {
            req[property] = customer
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
