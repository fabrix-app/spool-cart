
import { Email } from '@fabrix/spool-email'

export class Source extends Email {
  /**
   *
   * @param source
   * @param data
   * @param options
   * @returns {Promise.<{text: string, html:string}>}
   */
  expired(source, data, options) {
    const SourceModel = this.app.models['Source']
    let resSource
    return SourceModel.resolve(source, options)
      .then(_source => {
        if (!_source) {
          throw new Error('Source did not resolve')
        }
        resSource = _source

        return resSource.resolveCustomer({transaction: options.transaction || null})
      })
      .then(() => {
        const subject = data.subject || `Your ${resSource.getBrand() } ${ resSource.getType() } expired`
        const sendEmail = typeof data.send_email !== 'undefined' ? data.send_email : true
        this.app.log.debug(`SOURCE EXPIRED SEND EMAIL ${ resSource.token }`, sendEmail)

        return this.compose('expired', subject, resSource, sendEmail)
      })
  }

  /**
   *
   * @param source
   * @param data
   * @param options
   * @returns {Promise.<{text: string, html:string}>}
   */
  willExpire(source, data, options) {
    options = options || {}
    data = data || {}
    const SourceModel = this.app.models['Source']
    let resSource
    return SourceModel.resolve(source, options)
      .then(_source => {
        if (!_source) {
          throw new Error('Source did not resolve')
        }
        resSource = _source

        return resSource.resolveCustomer({transaction: options.transaction || null})
      })
      .then(() => {
        const subject = data.subject || `Your ${resSource.getBrand() } ${ resSource.getType() } will expire next month`
        const sendEmail = typeof data.send_email !== 'undefined' ? data.send_email : true
        this.app.log.debug(`SOURCE WILL EXPIRE SEND EMAIL ${ resSource.token }`, sendEmail)

        return this.compose('willExpire', subject, resSource, sendEmail)
      })
  }
}
