// tslint:disable:max-line-length
import { Template } from '@fabrix/spool-email'
import * as moment from 'moment'

export class Subscription extends Template {
  /**
   *
   * @param subscription
   * @returns {string}
   */
  cancelled(subscription) {
    const cancelTimeDate = new Date(subscription.cancelled_at)
    const cancelTime = moment(cancelTimeDate.toDateString()).format('LLLL')

    const subscriptionItems = subscription.line_items.map(item => {
      return `<p>${ item.name } x ${item.quantity } - ${ this.app.services.ProxyCartService.formatCurrency(item.calculated_price, subscription.currency)}</p>`
    }).join('\n')

    let reason
    switch (subscription.cancel_reason) {
    case 'funding':
      reason = 'because we were unable to process your billing method'
      break
    case 'inventory':
      reason = 'because we are unable to fulfill your subscription'
      break
    case 'fraud':
      reason = 'because it was reported fraudulent'
      break
    case 'other':
    case 'customer':
      reason = 'by your request'
      break
    default:
      reason = 'by your request'
    }

    return `<h1>Subscription ${ subscription.token } Cancelled</h1>
<p>Dear ${subscription.Customer ? subscription.Customer.getSalutation() : 'Customer'},</p>
<p>Your subscription was cancelled ${reason} and cancelled at ${cancelTime}.</p>
<h5>Cancelled Subscription Items</h5>
${subscriptionItems}
<p>Thank you!</p>`
  }

  /**
   *
   * @param subscription
   * @returns {string}
   */
  failed(subscription) {

    const cancelTimeDate = new Date(subscription.renews_on)
    const cancelTime = moment(cancelTimeDate.toDateString())
      .add(this.app.config.get('cart.subscriptions.grace_period_days') || 0, 'days')
      .format('LLLL')

    const subscriptionItems = subscription.line_items.map(item => {
      return `<p>${ item.name } x ${item.quantity } - ${ this.app.services.ProxyCartService.formatCurrency(item.calculated_price, subscription.currency)}</p>`
    }).join('\n')

    return `<h1>Subscription ${ subscription.token } Failed to Renew</h1>
<p>Dear ${subscription.Customer ? subscription.Customer.getSalutation() : 'Customer'},</p>
<p>Your subscription failed to renew and is at risk of being cancelled.</p>
<p>To avoid cancellation of your subscription, please update your payment method or contact customer services.</p>
<p>Your Subscription is set to cancel on ${ cancelTime }</p>
<p>Subscription Order Number: ${ subscription.last_order.name }</p>
<h5>Subscription Items</h5>
${subscriptionItems}
<p>------------------------</p>
<p>Subtotal: ${ this.app.services.ProxyCartService.formatCurrency(subscription.subtotal_price, subscription.currency)}</p>
<p>Total: ${ this.app.services.ProxyCartService.formatCurrency(subscription.total_price, subscription.currency)}</p>
<p>------------------------</p>
<p>Thank you!</p>`
  }

  /**
   *
   * @param subscription
   * @returns {string}
   */
  renewed(subscription) {
    // let renewTime = new Date(subscription.renewed_at)
    // renewTime = moment(renewTime).format('LLLL')
    const renewOnTimeDate = new Date(subscription.renews_on)
    const renewOnTime = moment(renewOnTimeDate.toDateString()).format('LLLL')

    const subscriptionItems = subscription.line_items.map(item => {
      return `<p>${ item.name } x ${ item.quantity } - ${ this.app.services.ProxyCartService.formatCurrency(item.calculated_price, subscription.currency)}</p>`
    }).join('\n')

    return `<h1>Subscription ${ subscription.token } Renewed</h1>
<p>Dear ${subscription.Customer ? subscription.Customer.getSalutation() : 'Customer'},</p>
<p>Your subscription has renewed.</p>
<p>Subscription Order Number: ${ subscription.last_order.name }</p>
<p>Next renewal date: ${renewOnTime}</p>
<h5>Renewed Subscription Items</h5>
${subscriptionItems}
<p>------------------------</p>
<p>Subtotal: ${ this.app.services.ProxyCartService.formatCurrency(subscription.subtotal_price, subscription.currency)}</p>
<p>Total: ${ this.app.services.ProxyCartService.formatCurrency(subscription.total_price, subscription.currency)}</p>
<p>------------------------</p>
<p>Thank you!</p>`
  }

  /**
   *
   * @param subscription
   * @returns {string}
   */
  activated(subscription) {
    const renewTimeDate = new Date(subscription.renewed_at)
    const renewTime = moment(renewTimeDate.toDateString()).format('LLLL')

    const renewOnTimeDate = new Date(subscription.renews_on)
    const renewOnTime = moment(renewOnTimeDate.toDateString()).format('LLLL')

    const subscriptionItems = subscription.line_items.map(item => {
      return `<p>${ item.name } x ${item.quantity } - ${ this.app.services.ProxyCartService.formatCurrency(item.calculated_price, subscription.currency)}</p>`
    }).join('\n')

    return `<h1>Subscription ${ subscription.token } Activated</h1>
<p>Dear ${subscription.Customer ? subscription.Customer.getSalutation() : 'Customer'},</p>
<p>Your subscription has been activated.</p>
<p>Start date: ${renewTime}</p>
<p>Next renewal date: ${renewOnTime}</p>
<h5>Subscription Items</h5>
${subscriptionItems}
<p>Thank you!</p>`
  }

  /**
   *
   * @param subscription
   * @returns {string}
   */
  deactivated(subscription) {
    const renewTimeDate = new Date(subscription.renewed_at)
    const renewTime = moment(renewTimeDate.toDateString()).format('LLLL')

    const renewOnTimeDate = new Date(subscription.renews_on)
    const renewOnTime = moment(renewOnTimeDate.toDateString()).format('LLLL')

    const subscriptionItems = subscription.line_items.map(item => {
      return `<p>${ item.name } x ${item.quantity } - ${ this.app.services.ProxyCartService.formatCurrency(item.calculated_price, subscription.currency)}</p>`
    }).join('\n')

    return `<h1>Subscription ${ subscription.token } Deactivated</h1>
<p>Dear ${subscription.Customer ? subscription.Customer.getSalutation() : 'Customer'},</p>
<p>Your subscription has been deactivated and will be cancelled at the end of this billing period.</p>
<p>Start date: ${renewTime}</p>
<p>Cancellation date: ${renewOnTime}</p>
<h5>Subscription Items</h5>
${subscriptionItems}
<p>Thank you!</p>`
  }

  /**
   *
   * @param subscription
   * @returns {string}
   */
  updated(subscription) {
    const renewTimeDate = new Date(subscription.renewed_at)
    const renewTime = moment(renewTimeDate.toDateString()).format('LLLL')

    const renewOnTimeDate = new Date(subscription.renews_on)
    const renewOnTime = moment(renewOnTimeDate.toDateString()).format('LLLL')

    const subscriptionItems = subscription.line_items.map(item => {
      return `<p>${ item.name } x ${item.quantity } - ${ this.app.services.ProxyCartService.formatCurrency(item.calculated_price, subscription.currency)}</p>`
    }).join('\n')

    return `<h1>Subscription ${ subscription.token } Updated</h1>
<p>Dear ${subscription.Customer ? subscription.Customer.getSalutation() : 'Customer'},</p>
<p>Your subscription has been updated.</p>
<p>Start date: ${renewTime}</p>
<p>Next renewal date: ${renewOnTime}</p>
<h5>Subscription Items</h5>
${subscriptionItems}
<p>Thank you!</p>`
  }

  /**
   *
   * @param subscription
   * @returns {string}
   */
  willRenew(subscription) {
    const renewOnTimeDate = new Date(subscription.renews_on)
    const renewOnTime = moment(renewOnTimeDate.toDateString()).format('LLLL')

    const subscriptionItems = subscription.line_items.map(item => {
      return `<p>${ item.name } x ${item.quantity } - ${ this.app.services.ProxyCartService.formatCurrency(item.calculated_price, subscription.currency)}</p>`
    }).join('\n')

    return `<h1>Subscription ${ subscription.token } Will Renew</h1>
<p>Dear ${subscription.Customer ? subscription.Customer.getSalutation() : 'Customer'},</p>
<p>Your subscription will renew on ${renewOnTime}.</p>
<h5>Subscription items that will renew</h5>
${subscriptionItems}
<p>Thank you!</p>`
  }
}
