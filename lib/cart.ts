import { clone } from 'lodash'
import { RenderGeneric } from '@fabrix/generics-render'
import { DefaultShippingProvider } from './api/generics/shippingProvider/index'
import { DefaultTaxProvider } from './api/generics/taxProvider/index'
import { ManualFulfillmentProvider } from './api/generics/fulfillmentProvider/index'
import { DefaultImageProvider } from './api/generics/imageProvider/index'
import { DefaultGeolocationProvider } from './api/generics/geolocationProvider/index'

export const Cart = {

  /**
   * configure
   * @param app
   */
  configure: (app) => {
    const cart = app.services.ProxyCartService
    const webMiddlewares = app.config.get('web.middlewares')

    app.config.set('web.middlewares', Object.assign(webMiddlewares, {
      cartInit: cart.initialize(cart),
      cartSession: cart.authenticate(cart),
      cartSessionCart: cart.cart(cart),
      cartSessionCustomer: cart.customer(cart)
    }))

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
        adapter: DefaultShippingProvider,
        config: {}
      })
    }
    if (!app.config.get('generics.fulfillment_provider.adapter')) {
      app.config.set('generics.fulfillment_provider', {
        adapter: ManualFulfillmentProvider,
        config: {}
      })
    }
    if (!app.config.get('generics.tax_provider.adapter')) {
      app.config.set('generics.tax_provider', {
        adapter: DefaultTaxProvider,
        config: {}
      })
    }
    if (!app.config.get('generics.image_provider.adapter')) {
      app.config.set('generics.image_provider', {
        adapter: DefaultImageProvider,
        config: {}
      })
    }
    if (!app.config.get('generics.geolocation_provider.adapter')) {
      app.config.set('generics.geolocation_provider', {
        adapter: DefaultGeolocationProvider,
        config: {}
      })
    }
    if (!app.config.get('generics.render_service.adapter')) {
      app.config.set('generics.render_service', {
        adapter: RenderGeneric,
        config: {
          // Must always be set to true
          html: true,
          plugins: [
            // Example Plugin (markdown-it-meta is required and already installed)
            // {
            //   plugin: require('markdown-it-meta'),
            //   config: {}
            // }
          ]
        }
      })
    }
    return Promise.resolve({})
  }
}
