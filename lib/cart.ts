


import { clone } from 'lodash'
export const Cart = {

  /**
   * configure
   * @param app
   */
  configure: (app) => {
    const proxyCart = app.services.ProxyCartService
    app.config.web.middlewares.cartInit = proxyCart.initialize(proxyCart)
    app.config.web.middlewares.cartSession = proxyCart.authenticate(proxyCart)
    app.config.web.middlewares.cartSessionCart = proxyCart.cart(proxyCart)
    app.config.web.middlewares.cartSessionCustomer = proxyCart.customer(proxyCart)
    return Promise.resolve()
  },
  /**
   * copyDefaults - Copies the default configuration so that it can be restored later
   * @param app
   * @returns {Promise.<{}>}
   */
  copyDefaults: (app) => {
    app.config.set('cartDefaults', clone(app.config.get('cart')))
    return Promise.resolve({})
  },
  /**
   * resolveGenerics - adds default generics if missing from configuration
   * @param app
   * @returns {Promise.<{}>}
   */
  resolveGenerics: (app) => {
    if (!app.config.get('generics.shipping_provider.adapter')) {
      app.config.set('generics.shipping_provider', {
        adapter: require('../api/generics').shippingProvider,
        config: {}
      })
    }
    if (!app.config.get('generics.fulfillment_provider.adapter')) {
      app.config.set('generics.fulfillment_provider', {
        adapter: require('../api/generics').fulfillmentProvider,
        config: {}
      })
    }
    if (!app.config.get('generics.tax_provider.adapter')) {
      app.config.set('generics.tax_provider', {
        adapter: require('../api/generics').taxProvider,
        config: {
          app: app
        }
      })
    }
    if (!app.config.get('generics.image_provider.adapter')) {
      app.config.set('generics.image_provider', {
        adapter: require('../api/generics').imageProvider,
        config: {}
      })
    }
    if (!app.config.get('generics.geolocation_provider.adapter')) {
      app.config.set('generics.geolocation_provider', {
        adapter: require('../api/generics').geolocationProvider,
        config: {}
      })
    }
    if (!app.config.get('generics.render_service.adapter')) {
      app.config.set('generics.render_service', {
        adapter: require('generics-render'),
        config: {
          // Must always be set to true
          html: true
        },
        plugins: [
          // Example Plugin (markdown-it-meta is required and already installed)
          // {
          //   plugin: require('markdown-it-meta'),
          //   config: {}
          // }
        ]
      })
    }
    return Promise.resolve({})
  }
}
