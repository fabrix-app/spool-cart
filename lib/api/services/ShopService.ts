

import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
// const _ = require('lodash')
// const Errors = require('engine-errors')

/**
 * @module ShopService
 * @description Shop Service
 */
export class ShopService extends Service {
  /**
   *
   * @param data
   * @param options
   * @returns {data}
   */
  create(data, options) {
    const Shop = this.app.models.Shop
    return Shop.create(data, options)
  }
}

