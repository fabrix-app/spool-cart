
import { Email } from '@fabrix/spool-email'

export class Subscription extends Email {
  /**
   *
   * @param subscription
   * @param data
   * @param options
   * @returns {Promise.<{text: string, html:string}>}
   */
  cancelled(subscription, data, options) {
    options = options || {}
    data = data || {}
    const SubscriptionModel = this.app.models['Subscription']
    let resSubscription
    return SubscriptionModel.resolve(subscription, options)
      .then(_subscription => {
        if (!_subscription) {
          throw new Error('Subscription did not resolve')
        }
        resSubscription = _subscription

        return resSubscription.resolveCustomer({transaction: options.transaction || null})
      })
      .then(() => {
        return resSubscription.resolveLastOrder({transaction: options.transaction})
      })
      .then(() => {

        const subject = data.subject || `Subscription ${ resSubscription.token } Cancelled`
        const sendEmail = typeof data.send_email !== 'undefined' ? data.send_email : true
        this.app.log.debug(`SUBSCRIPTION CANCELLED SEND EMAIL ${ resSubscription.token }`, sendEmail)

        return this.compose('cancelled', subject, resSubscription, sendEmail)
      })

  }
  /**
   *
   * @param subscription
   * @param data
   * @param options
   * @returns {Promise.<{text: string, html:string}>}
   */
  failed(subscription, data, options) {
    options = options || {}
    data = data || {}
    const SubscriptionModel = this.app.models['Subscription']
    let resSubscription
    return SubscriptionModel.resolve(subscription, options)
      .then(_subscription => {
        if (!_subscription) {
          throw new Error('Subscription did not resolve')
        }
        resSubscription = _subscription

        return resSubscription.resolveCustomer({transaction: options.transaction || null})
      })
      .then(() => {
        return resSubscription.resolveLastOrder({transaction: options.transaction})
      })
      .then(() => {

        const subject = data.subject || `Subscription ${ resSubscription.token } Failed to Renew`
        const sendEmail = typeof data.send_email !== 'undefined' ? data.send_email : true
        this.app.log.debug(`SUBSCRIPTION FAILED SEND EMAIL ${ resSubscription.token }`, sendEmail)

        return this.compose('failed', subject, resSubscription, sendEmail)
      })

  }
  /**
   *
   * @param subscription
   * @param data
   * @param options
   * @returns {Promise.<{text: string, html:string}>}
   */
  renewed(subscription, data, options) {
    options = options || {}
    data = data || {}
    // const SubscriptionModel = this.app.models['Subscription']
    const SubscriptionModel = this.app.models['Subscription']
    let resSubscription
    return SubscriptionModel.resolve(subscription, {transaction: options.transaction || null })
      .then(_subscription => {
        if (!_subscription) {
          throw new Error('Subscription did not resolve')
        }
        resSubscription = _subscription
        return resSubscription.resolveCustomer({transaction: options.transaction || null})
      })
      .then(() => {
        return resSubscription.resolveLastOrder({transaction: options.transaction})
      })
      .then(() => {

        const subject = data.subject || `Subscription ${ resSubscription.token } Renewed`
        const sendEmail = typeof data.send_email !== 'undefined' ? data.send_email : true
        this.app.log.debug(`SUBSCRIPTION RENEWED SEND EMAIL ${ resSubscription.token }`, sendEmail)

        return this.compose('renewed', subject, resSubscription, sendEmail)
      })

  }
  /**
   *
   * @param subscription
   * @param data
   * @param options
   * @returns {Promise.<{text: string, html:string}>}
   */
  activated(subscription, data, options) {
    options = options || {}
    data = data || {}
    const SubscriptionModel = this.app.models['Subscription']
    let resSubscription
    return SubscriptionModel.resolve(subscription, options)
      .then(_subscription => {
        if (!_subscription) {
          throw new Error('Subscription did not resolve')
        }
        resSubscription = _subscription
        return resSubscription.resolveCustomer({transaction: options.transaction || null})
      })
      .then(() => {

        const subject = data.subject || `Subscription ${ resSubscription.token } Activated`
        const sendEmail = typeof data.send_email !== 'undefined' ? data.send_email : true
        this.app.log.debug(`SUBSCRIPTION ACTIVATED SEND EMAIL ${ resSubscription.token }`, sendEmail)

        return this.compose('activated', subject, resSubscription, sendEmail)
      })

  }
  /**
   *
   * @param subscription
   * @param data
   * @param options
   * @returns {Promise.<{text: string, html:string}>}
   */
  deactivated(subscription, data, options) {
    options = options || {}
    data = data || {}
    const SubscriptionModel = this.app.models['Subscription']
    let resSubscription
    return SubscriptionModel.resolve(subscription, options)
      .then(_subscription => {
        if (!_subscription) {
          throw new Error('Subscription did not resolve')
        }
        resSubscription = _subscription
        return resSubscription.resolveCustomer({transaction: options.transaction || null})
      })
      .then(() => {

        const subject = data.subject || `Subscription ${ resSubscription.token } Deactivated`
        const sendEmail = typeof data.send_email !== 'undefined' ? data.send_email : true
        this.app.log.debug(`SUBSCRIPTION DEACTIVATED SEND EMAIL ${ resSubscription.token }`, sendEmail)

        return this.compose('deactivated', subject, resSubscription, sendEmail)
      })
  }

  /**
   *
   * @param subscription
   * @param data
   * @param options
   * @returns {Promise.<{text: string, html:string}>}
   */
  updated(subscription, data, options) {
    options = options || {}
    data = data || {}
    const SubscriptionModel = this.app.models['Subscription']
    let resSubscription
    return SubscriptionModel.resolve(subscription, options)
      .then(_subscription => {
        if (!_subscription) {
          throw new Error('Subscription did not resolve')
        }

        resSubscription = _subscription

        return resSubscription.resolveCustomer({transaction: options.transaction || null})
      })
      .then(() => {

        const subject = data.subject || `Subscription ${ resSubscription.token } Updated`
        const sendEmail = typeof data.send_email !== 'undefined' ? data.send_email : true
        this.app.log.debug(`SUBSCRIPTION UPDATED SEND EMAIL ${ resSubscription.token }`, sendEmail)

        return this.compose('updated', subject, resSubscription, sendEmail)
      })
  }

  /**
   *
   * @param subscription
   * @param data
   * @param options
   * @returns {Promise.<{text: string, html:string}>}
   */
  willRenew(subscription, data, options) {
    options = options || {}
    data = data || {}
    const SubscriptionModel = this.app.models['Subscription']
    let resSubscription
    return SubscriptionModel.resolve(subscription, options)
      .then(_subscription => {
        if (!_subscription) {
          throw new Error('Subscription did not resolve')
        }

        resSubscription = _subscription

        return resSubscription.resolveCustomer({transaction: options.transaction || null})
      })
      .then(() => {

        const subject = data.subject || `Subscription ${ resSubscription.token } Will Renew`
        const sendEmail = typeof data.send_email !== 'undefined' ? data.send_email : true
        this.app.log.debug(`SUBSCRIPTION WILL RENEW SEND EMAIL ${ resSubscription.token }`, sendEmail)

        return this.compose('willRenew', subject, resSubscription, sendEmail)
      })

  }
}
