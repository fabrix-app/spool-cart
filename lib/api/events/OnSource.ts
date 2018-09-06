import { Event } from '@fabrix/spool-events'

export class OnSource extends Event {
  subscribe() {
    this.app.services.EventsService.subscribe('OnSource.created', 'customer.source.created', this.created)
    this.app.services.EventsService.subscribe('OnSource.updated', 'customer.source.updated', this.updated)
  }
  created(msg, data, options) {
    options = options || {}
    // this.app.log.debug('onSource.created', msg)
    // // try and fix broken/failed transactions
    // this.app.services.AccountService.sourceRetryTransactions(data.data)
    //   .catch(err => {
    //     this.app.log.error(err)
    //   })
  }
  updated(msg, data, options) {
    options = options || {}
    // this.app.log.debug('onSource.updated', msg)
    // try and fix broken/failed transactions
    this.app.services.AccountService.sourceRetryTransactions(data.data, {transaction: options.transaction || null})
      .catch(err => {
        this.app.log.error(err)
      })
  }
}
