import { Generic } from '@fabrix/spool-generics'

export class DefaultShippingProvider extends Generic {
  constructor(config) {
    super(config)
    // this.config = config
  }
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
