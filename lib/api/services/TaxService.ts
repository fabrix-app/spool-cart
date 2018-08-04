import { FabrixService as Service } from '@fabrix/fabrix/dist/common'

/**
 * @module TaxService
 * @description Tax Service
 */
export class TaxService extends Service {
  calculate(obj, lineItems, shippingAddress, resolver, options: {[key: string]: any} = {}) {
    let resObj
    return resolver.resolve(obj, {transaction: options.transaction || null})
      .then(_obj => {
        if (!_obj) {
          throw new Error('Could not resolve for taxes')
        }
        resObj = _obj
        return this.app.services.ProxyCartService.resolveItemsFromTo(resObj, lineItems.filter(i => i.requires_taxes), shippingAddress)
      })
      .then(resolvedItemsFromTo => {
        if (!resolvedItemsFromTo) {
          return resObj
        }
        return this.getTaxes(resObj, lineItems, resolvedItemsFromTo, options)
      })
      .then(taxesResult => {
        return taxesResult
      })
  }

  /**
   *
   */
  getTaxes(obj, lineItems = [], resolvedItemsFromTo, options: {[key: string]: any} = {}) {
    const taxProvider = this.app.config.get(`generics.${obj.tax_provider}`)
      || this.app.config.get('generics.tax_provider')

    // console.log('WORKING ON TAXES TAX FOR ORDER', obj, lineItems, sendFromTo)
    return this.app.services.TaxGenericService.taxForOrder({
      nexus_addresses: resolvedItemsFromTo.nexus_addresses,
      to_address: resolvedItemsFromTo.to_address,
      line_items: lineItems,
      subtotal_price: obj.subtotal_price,
      total_shipping: obj.total_shipping
    }, taxProvider)
  }
}

