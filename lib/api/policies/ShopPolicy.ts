import { FabrixPolicy as Policy } from '@fabrix/fabrix/dist/common'
/**
 * @module ShopPolicy
 * @description Shop Policy
 */
export class ShopPolicy extends Policy {
  session(req, res, next) {
    let err
    if (!req.shop) {
      err = new Error('session requires a shop')
    }
    next(err)
  }
}

