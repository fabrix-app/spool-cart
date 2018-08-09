import { FabrixPolicy as Policy } from '@fabrix/fabrix/dist/common'
/**
 * @module CartPolicy
 * @description Cart Policy
 */
export class CartPolicy extends Policy {
  session(req, res, next) {
    let err
    if (!req.cart) {
      err = new Error('session requires a cart')
    }
    next(err)
  }
}

