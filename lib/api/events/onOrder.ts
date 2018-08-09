import { Event } from '@fabrix/spool-engine'

export class OnOrder extends Event {
  subscribe() {
    // this.app.services.EngineService.subscribe('OnOrder.fulfilled', 'order.fulfillment_status.fulfilled', this.fulfilled)
    // this.app.services.EngineService.subscribe('OnOrder.updated', 'customer.order.updated', this.updated)
  }
  // fulfilled(msg, data, options) {
  //   return this.app.models['Order'].findById(data.object_id, {transaction: options.transaction || null})
  //     .then(foundOrder => {
  //     })
  // }
}
