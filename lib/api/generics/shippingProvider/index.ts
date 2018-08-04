import { Generic } from '@fabrix/spool-generics'

export class DefaultShippingProvider extends Generic {

  validateAddress(data) {
    return Promise.resolve(data)
  }
  getRate(data) {
    return Promise.resolve({})
  }
  getRates(data) {
    return Promise.resolve([])
  }
}
