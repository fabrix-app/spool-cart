
/**
 * Module dependencies.
 */

const req: {[key: string]: any} = module.exports = {}

/**
 * Initiate a login session for `cart`.
 *
 * Options:
 *   - `session`  Save login state in session, defaults to _true_
 *
 * Examples:
 *
 *     req.logInCart(cart, { session: false })
 *
 *     req.logInCart(cart, function(err) {
 *       if (err) { throw err }
 *       // session saved
 *     })
 *
 * @param {Cart} cart
 * @param {Object} options
 * @param {Function} done
 * @api public
 */
req.loginCart =
  req.logInCart = function(cart, options, done) {
    if (typeof options === 'function') {
      done = options
      options = {}
    }
    options = options || {}

    let property = 'cart'
    if (this._cart && this._cart.instance) {
      property = this._cart.instance._cartProperty || 'cart'
    }
    const session = (options.session === undefined) ? true : options.session

    this[property] = cart
    if (session) {
      if (!this._cart) {
        throw new Error('cart.initialize() middleware not in use')
      }
      if (typeof done !== 'function') {
        throw new Error('req#loginCart requires a callback function')
      }

      this._cart.instance.serializeCart(cart, (err, obj) => {
        if (err) {
          this[property] = null
          return done(err)
        }
        if (!this._cart.session) {
          this._cart.session = {}
        }
        this._cart.session.cart = obj
        if (!this.session) {
          this.session = {}
        }
        this.session[this._cart.instance._key] = this._cart.session
        done()
      })
    }
    else {
      // tslint:disable:no-unused-expression
      done && done()
    }
  }

/**
 * Initiate a login session for `customer`.
 *
 * Options:
 *   - `session`  Save login state in session, defaults to _true_
 *
 * Examples:
 *
 *     req.logInCustomer(customer, { session: false })
 *
 *     req.logInCustomer(customer, function(err) {
 *       if (err) { throw err }
 *       // session saved
 *     })
 *
 * @param {Customer} customer
 * @param {Object} options
 * @param {Function} done
 * @api public
 */
req.loginCustomer =
  req.logInCustomer = function(customer, options, done) {
    if (typeof options === 'function') {
      done = options
      options = {}
    }
    options = options || {}

    let property = 'customer'
    if (this._cart && this._cart.instance) {
      property = this._cart.instance._customerProperty || 'customer'
    }
    const session = (options.session === undefined) ? true : options.session

    this[property] = customer
    if (session) {
      if (!this._cart) {
        throw new Error('cart.initialize() middleware not in use')
      }
      if (typeof done !== 'function') {
        throw new Error('req#loginCustomer requires a callback function')
      }

      this._cart.instance.serializeCustomer(customer, (err, obj) => {
        if (err) {
          this[property] = null
          return done(err)
        }
        if (!this._cart.session) {
          this._cart.session = {}
        }
        this._cart.session.customer = obj
        if (!this.session) {
          this.session = {}
        }
        this.session[this._cart.instance._key] = this._cart.session
        done()
      })
    }
    else {
      // tslint:disable:no-unused-expression
      done && done()
    }
  }

/**
 * Terminate an existing login session.
 *
 * @api public
 */
req.logoutCart =
  req.logOutCart = function() {
    let property = 'cart'
    if (this._cart && this._cart.instance) {
      property = this._cart.instance._cartProperty || 'cart'
    }

    this[property] = null
    if (this._cart && this._cart.session) {
      delete this._cart.session.cart
    }
  }

/**
 * Terminate an existing login session.
 *
 * @api public
 */
req.logoutCustomer =
  req.logOutCustomer = function() {
    let property = 'customer'
    if (this._cart && this._cart.instance) {
      property = this._cart.instance._customerProperty || 'customer'
    }

    this[property] = null
    if (this._cart && this._cart.session) {
      delete this._cart.session.customer
    }
  }

/**
 * Test if request is has a cart.
 *
 * @return {Boolean}
 * @api public
 */
req.hasCart = function() {
  let property = 'cart'
  if (this._cart && this._cart.instance) {
    property = this._cart.instance._cartProperty || 'cart'
  }

  return !!(this[property])
}

/**
 * Test if request has no cart.
 *
 * @return {Boolean}
 * @api public
 */
req.hasNoCart = function() {
  return !this.hasCart()
}

/**
 * Test if request is has a customer.
 *
 * @return {Boolean}
 * @api public
 */
req.hasCustomer = function() {
  let property = 'customer'
  if (this._cart && this._cart.instance) {
    property = this._cart.instance._customerProperty || 'customer'
  }

  return !!(this[property])
}

/**
 * Test if request has no customer.
 *
 * @return {Boolean}
 * @api public
 */
req.hasNoCustomer = function() {
  return !this.hasCustomer()
}
