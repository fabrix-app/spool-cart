import { Spool } from '@fabrix/fabrix/dist/common'
import { Cart } from './cart'
import * as Validator from './validator'
import { Utils } from './utils'

import * as config from './config/index'
import * as pkg from '../package.json'
import * as api from './api/index'

export class CartSpool extends Spool {

  constructor(app) {
    super(app, {
      config: config,
      pkg: pkg,
      api: api
    })
  }

  /**
   * Validates Configs
   */
  async validate () {

    const requiredSpools = [
      'router', 'express', 'sequelize', 'engine',
      'permissions', 'passport', 'notifications',
      'generics', 'cart-countries'
    ]

    const spools = Object.keys(this.app.spools)

    if (!spools.some(v => requiredSpools.indexOf(v) >= 0)) {
      return Promise.reject(new Error(`spool-cart requires spools: ${ requiredSpools.join(', ') }!`))
    }

    // Configs
    if (!this.app.config.get('engine')) {
      return Promise.reject(new Error('No configuration found at config.engine!'))
    }

    if (!this.app.config.get('cart')) {
      return Promise.reject(new Error('No configuration found at config.cart!'))
    }

    if (!this.app.config.get('notifications')) {
      return Promise.reject(new Error('No configuration found at config.notifications!'))
    }

    if (!this.app.config.get('generics')) {
      return Promise.reject(new Error('No configuration found at config.generics!'))
    }

    if (!this.app.config.get('permissions')) {
      return Promise.reject(new Error('No configuration found at config.permissions!'))
    }

    if (!this.app.config.get('passport')) {
      return Promise.reject(new Error('No configuration found at config.passport!'))
    }

    // TODO Refactor
    // if (
    //   this.app.config.policies
    //   && this.app.config.policies['*']
    //   && this.app.config.policies['*'].indexOf('CheckPermissions.checkRoute') === -1
    // ) {
    //   this.app.log.warn('ProxyCart Routes are unlocked! add \'*\' : [\'CheckPermissions.checkRoute\'] to config/policies.js')
    // }

    return Promise.all([
      // Validator.validateStores.config(Object.values(this.app.config.get('stores'))),
      Validator.validateCartSpool.config(this.app.config.get('cart')),
      Validator.validateMiddleware.config(this.app.config.get('web.middlewares'))
    ])
  }

  /**
   * Adds Routes, Policies, Generics, and Agenda
   */
  async configure () {
    return Promise.all([
      Cart.configure(this.app),
      Cart.resolveGenerics(this.app),
      Cart.copyDefaults(this.app)
    ])
  }

  /**
   * Loads default shop and country fixtures
   */
  async initialize () {
    return Promise.all([
      Utils.buildShopFixtures(this.app)
        .then(fixtures => {
          this.shopFixtures = fixtures
          return Utils.loadShopFixtures(this.app)
        }),
      Utils.buildCountryFixtures(this.app)
        .then(fixtures => {
          this.countryFixtures = fixtures
          return Utils.loadCountryFixtures(this.app)
        })
    ])
  }
}

