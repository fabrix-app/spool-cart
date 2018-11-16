import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
import { defaultsDeep } from 'lodash'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'

/**
 * @module ShopService
 * @description Shop Service
 */
export class ShopService extends Service {
  publish(type, event, options: {save?: boolean, transaction?: any, include?: any} = {}) {
    if (this.app.services.EventsService) {
      options.include = options.include ||  [{
        model: this.app.models.EventItem.instance,
        as: 'objects'
      }]
      return this.app.services.EventsService.publish(type, event, options)
    }
    this.app.log.debug('spool-events is not installed, please install it to use publish')
    return Promise.resolve()
  }
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

  /**
   *
   * @param data
   * @param options
   * @returns {data}
   */
  update(shop, data, options) {
    const Shop = this.app.models.Shop
    return Shop.resolve(shop, { transaction: options.transaction || null })
      .then(_shop => {
        if (!_shop) {
          throw new ModelError('E_NOT_FOUND', `Shop ${shop} not found`)
        }
        const resShop = defaultsDeep(_shop, data)

        return resShop.save({ transaction: options.transaction || null })
      })
  }
}

