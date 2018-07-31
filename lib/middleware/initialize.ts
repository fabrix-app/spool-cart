// tslint:disable:no-shadowed-variable

/**
 * Cart initialization.
 *
 * Initializes Cart for incoming requests, allowing cart and customer sessions
 *
 * If sessions are being utilized, applications must set up ProxyCart with
 * functions to serialize a cart/customer into and out of a session.  For example, a
 * common pattern is to serialize just the cart/customer ID into the session (due to the
 * fact that it is desirable to store the minimum amount of data in a session).
 * When a subsequent request arrives for the session, the full Cart/Customer object can
 * be loaded from the database by ID.
 *
 * Note that additional middleware is required to persist login state, so we
 * must use the `connect.session()` middleware _before_ `cart.initialize()`.
 *
 * If sessions are being used, this middleware must be in use by the
 * Connect/Express application for Cart to operate.  If the application is
 * entirely stateless (not using sessions), this middleware is not necessary,
 * but its use will not have any adverse impact.
 *
 * Examples:
 *
 *     app.use(connect.cookieParser());
 *     app.use(connect.session({ secret: 'keyboard cat' }));
 *     app.use(cart.initialize());
 *     app.use(cart.session());
 *
 *     cart.serializeCart(function(cart, done) {
 *       done(null, cart.id);
 *     });
 *
 *     cart.deserializeCart(function(id, done) {
 *       Cart.findById(id, function (err, cart) {
 *         done(err, cart);
 *       });
 *     });
 *
 *     cart.serializeCustomer(function(customer, done) {
 *       done(null, customer.id);
 *     });
 *
 *     cart.deserializeCustomer(function(id, done) {
 *       Customer.findById(id, function (err, customer) {
 *         done(err, customer);
 *       });
 *     });
 *
 * @return {Function}
 * @api public
 */
export const initialize = function(cart) {

  return function initialize(req, res, next) {
    req._cart = {}
    req._cart.instance = cart

    if (req.session && req.session[cart._key]) {
      // load data from existing session
      req._cart.session = req.session[cart._key]
    }

    next()
  }
}
