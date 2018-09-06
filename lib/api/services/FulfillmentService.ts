import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { FULFILLMENT_SERVICE } from '../../enums'
import { FULFILLMENT_STATUS } from '../../enums'
// import { ORDER_FINANCIAL } from '../../enums'

/**
 * @module FulfillmentService
 * @description Fulfillment Service
 */
export class FulfillmentService extends Service {
  publish(type, event, options: {save?: boolean, transaction?: any, include?: any} = {}) {
    if (this.app.services.EventsService) {
      options.include = options.include ||  [{
        model: this.app.models.EventItem.instance,
        as: 'objects'
      }]
      return this.app.services.EventsService.publish(type, event, options)
    }
    this.app.log.debug('spool-events is not installed, please install it to use publish')
    return Promise.resolve()
  }
  /**
   *
   * @param order
   * @param fulfillment
   * @param options
   * @returns {Promise.<T>}
   */
  sendFulfillment(order, fulfillment, options: {[key: string]: any} = {}) {
    const Order = this.app.models['Order']
    const Fulfillment = this.app.models['Fulfillment']
    let resOrder, resFulfillment

    return Order.resolve(order, {transaction: options.transaction || null})
      .then(_order => {
        if (!_order) {
          throw new Error('Order not found')
        }
        resOrder = _order
        return Fulfillment.resolve(fulfillment, {transaction: options.transaction || null})
      })
      .then(_fulfillment => {
        if (!_fulfillment) {
          throw new ModelError('E_NOT_FOUND', 'Fulfillment not found')
        }
        resFulfillment = _fulfillment
        return resFulfillment.resolveOrderItems({transaction: options.transaction || null})
      })
      .then(() => {
        if (!resFulfillment.order_items) {
          throw new Error('Fulfillment missing order_items')
        }
        // If a manually supplied and a non-shippable item, mark as fully fulfilled
        if (
          resFulfillment.service === FULFILLMENT_SERVICE.MANUAL
          && !resFulfillment.order_items.some(i => i.requires_shipping === true)
        ) {
          resFulfillment.fulfilled()
          return Fulfillment.sequelize.Promise.mapSeries(resFulfillment.order_items, item => {
            item.fulfillment_status = resFulfillment.status
            return item.save({
              hooks: false,
              transaction: options.transaction || null
            })
          })
        }
        // If a manually supplied and a shippable item, mark as sent to manual
        else if (
          resFulfillment.service === FULFILLMENT_SERVICE.MANUAL
          && resFulfillment.order_items.some(i => i.requires_shipping === true)
        ) {
          resFulfillment.sent()
          return Fulfillment.sequelize.Promise.mapSeries(resFulfillment.order_items, item => {
            item.fulfillment_status = resFulfillment.status
            return item.save({
              hooks: false,
              transaction: options.transaction || null
            })
          })
        }
        else {
          return this.app.services.FulfillmentGenericService.createOrder(resFulfillment, resFulfillment.service)
            .then(result => {
              resFulfillment[result.status]()
              return Fulfillment.sequelize.Promise.mapSeries(resFulfillment.order_items, item => {
                item.fulfillment_status = resFulfillment.status
                return item.save({
                  hooks: false,
                  transaction: options.transaction || null
                })
              })
            })
        }
      })
      .then(() => {
        return resFulfillment.saveFulfillmentStatus({transaction: options.transaction || null})
      })
      .then(() => {
        // TODO, put this in life cycle
        const event = {
          object_id: resFulfillment.order_id,
          object: 'order',
          objects: [{
            order: resOrder.id
          }, {
            customer: resOrder.customer_id
          }, {
            fulfillment: resFulfillment.id
          }],
          type: `order.fulfillment.${resFulfillment.status}`,
          message: `Order ${resOrder.name} fulfillment ID ${resFulfillment.id} ${resFulfillment.status}`,
          data: resFulfillment
        }

        return this.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        return resFulfillment
      })
  }

  /**
   *
   * @param fulfillment
   * @param options
   * @returns {Promise.<T>}
   */
  updateFulfillment(fulfillment, options: {[key: string]: any} = {}) {
    const Fulfillment = this.app.models['Fulfillment']
    let resFulfillment
    return Fulfillment.resolve(fulfillment, {transaction: options.transaction || null})
      .then(_fulfillment => {
        if (!_fulfillment) {
          throw new Error('Fulfillment not found')
        }
        if ([FULFILLMENT_STATUS.FULFILLED, FULFILLMENT_STATUS.CANCELLED].indexOf(_fulfillment.status) > -1) {
          // tslint:disable:max-line-length
          throw new Error(`Fulfillment status must be ${ FULFILLMENT_STATUS.PENDING }, ${ FULFILLMENT_STATUS.NONE }, ${FULFILLMENT_STATUS.PARTIAL}, ${FULFILLMENT_STATUS.SENT} to update`)
        }

        resFulfillment = _fulfillment
        if ([FULFILLMENT_STATUS.NONE, FULFILLMENT_STATUS.PENDING].indexOf(resFulfillment.status) > -1) {
          return
        }
        else if ([FULFILLMENT_STATUS.SENT, FULFILLMENT_STATUS.PARTIAL].indexOf(resFulfillment.status) > -1) {
          return this.app.services.FulfillmentGenericService.updateOrder(resFulfillment, resFulfillment.service)
        }
        else {
          // Unhandled
          return
        }
      })
      .then(() => {
        return resFulfillment.saveFulfillmentStatus({transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param fulfillment
   * @param options
   * @returns {Promise.<TResult>}
   */
  cancelFulfillment(fulfillment, options: {[key: string]: any} = {}) {
    const Fulfillment = this.app.models['Fulfillment']
    let resFulfillment
    return Fulfillment.resolve(fulfillment, { transaction: options.transaction || null })
      .then(_fulfillment => {
        if (!_fulfillment) {
          throw new Error('Fulfillment not found')
        }
        if ([FULFILLMENT_STATUS.FULFILLED, FULFILLMENT_STATUS.CANCELLED].indexOf(_fulfillment.status) > -1) {
          // tslint:disable:max-line-length
          throw new Error(`Fulfillment status must be ${ FULFILLMENT_STATUS.PENDING }, ${ FULFILLMENT_STATUS.NONE }, ${FULFILLMENT_STATUS.PARTIAL}, ${FULFILLMENT_STATUS.SENT} to be cancelled`)
        }

        resFulfillment = _fulfillment

        return resFulfillment.resolveOrderItems({transaction: options.transaction || null})
      })
      .then(() => {
        if ([FULFILLMENT_STATUS.NONE, FULFILLMENT_STATUS.PENDING].indexOf(resFulfillment.status) > -1) {
          return
        }
        else if (resFulfillment.service === FULFILLMENT_SERVICE.MANUAL) {
          return
        }
        else {
          return this.app.services.FulfillmentGenericService.destroyOrder(resFulfillment, resFulfillment.service)
        }
      })
      .then(() => {
        resFulfillment.cancelled()
        return resFulfillment.fulfillUpdate(
          {status: FULFILLMENT_STATUS.CANCELLED },
          {transaction: options.transaction || null}
        )
      })
      .then(() => {
        return resFulfillment.save({transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param item
   * @param options
   * @returns {Promise.<T>}
   */
  addOrCreateFulfillmentItem(item, options: {[key: string]: any} = {}) {
    const OrderItem = this.app.models['OrderItem']
    const Fulfillment = this.app.models['Fulfillment']
    let resOrderItem, resFulfillment
    return OrderItem.resolve(item, {transaction: options.transaction || null})
      .then(_item => {
        if (!_item) {
          throw new ModelError('E_NOT_FOUND', 'Order Item not Found')
        }
        resOrderItem = _item
        return Fulfillment.findOne({
          where: {
            order_id: resOrderItem.order_id,
            service: resOrderItem.fulfillment_service
          },
          include: [
            {
              model: OrderItem.instance,
              as: 'order_items'
            }
          ],
          transaction: options.transaction || null
        })
      })
      .then(_fulfillment => {
        if (_fulfillment) {
          resFulfillment = _fulfillment
          return resFulfillment.addOrder_item(resOrderItem, {
            hooks: false,
            individualHooks: false,
            returning: false,
            transaction: options.transaction || null
          })
            .then(() => {
              return resFulfillment.reload({transaction: options.transaction || null})
                .then(() => {
                  return resFulfillment.saveFulfillmentStatus({transaction: options.transaction || null})
                })
            })
            .then(() => {
              return this.updateFulfillment(resFulfillment, {transaction: options.transaction || null})
            })
        }
        else {
          return Fulfillment.create({
            order_id: resOrderItem.order_id,
            service: resOrderItem.fulfillment_service,
            // order_items: [
            //   resOrderItem
            // ]
          }, {
            include: [
              {
                model: OrderItem.instance,
                as: 'order_items'
              }
            ],
            transaction: options.transaction || null
          })
          // return resFulfillment.save({transaction: options.transaction || null})
            .then(_newFulfillment => {
              if (!_newFulfillment) {
                throw new Error('Fulfillment was not created')
              }
              resFulfillment = _newFulfillment
              return resFulfillment.addOrder_item(resOrderItem, {
                hooks: false,
                individualHooks: false,
                returning: false,
                transaction: options.transaction || null
              })
                .then(() => {
                  return resFulfillment.reload({transaction: options.transaction || null})
                    .then(() => {
                      return resFulfillment.saveFulfillmentStatus({transaction: options.transaction || null})
                    })
                })
                .then(() => {
                  return this.updateFulfillment(resFulfillment, {transaction: options.transaction || null})
                })
            })
            // .then(() => {
            //   return resFulfillment.reload({transaction: options.transaction || null})
            // })
            // .then(() => {
            //   return resFulfillment.saveFulfillmentStatus({transaction: options.transaction || null})
            // })
        }
      })
      .then(() => {
        return resOrderItem.reload({transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param item
   * @param options
   * @returns {Promise.<TResult>}
   */
  updateFulfillmentItem(item, options: {[key: string]: any} = {}) {
    const OrderItem = this.app.models['OrderItem']
    const Fulfillment = this.app.models['Fulfillment']
    let resOrderItem, resFulfillment
    return OrderItem.resolve(item, {transaction: options.transaction || null})
      .then(_item => {
        if (!_item) {
          throw new ModelError('E_NOT_FOUND', 'Order Item not Found')
        }
        resOrderItem = _item
        return Fulfillment.findOne({
          where: {
            order_id: resOrderItem.order_id,
            service: resOrderItem.fulfillment_service
          },
          include: [
            {
              model: OrderItem.instance,
              as: 'order_items'
            }
          ],
          transaction: options.transaction || null
        })
      })
      .then(fulfillment => {
        if (!fulfillment) {
          throw new ModelError('E_NOT_FOUND', 'Fulfillment not found')
        }
        resFulfillment = fulfillment
        return resFulfillment.hasOrder_item(resOrderItem.id, {transaction: options.transaction || null})
      })
      .then(hasOrderItem => {
        if (!hasOrderItem) {
          return resFulfillment.addOrder_item(resOrderItem, {
            hooks: false,
            individualHooks: false,
            returning: false,
            transaction: options.transaction || null
          })
        }
        else {
          return
        }
      })
      .then(() => {
        return resFulfillment.reload({transaction: options.transaction || null})
      })
      .then(() => {
        return resFulfillment.saveFulfillmentStatus({transaction: options.transaction || null})
      })
      .then(() => {
        return this.updateFulfillment(resFulfillment, {transaction: options.transaction || null})
      })
      .then(() => {
        return resOrderItem.reload({transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param item
   * @param options
   * @returns {*|Promise.<TResult>}
   */
  removeFulfillmentItem(item, options: {[key: string]: any} = {}) {
    const OrderItem = this.app.models['OrderItem']
    const Fulfillment = this.app.models['Fulfillment']
    let resOrderItem, resFulfillment
    return OrderItem.resolve(item, options)
      .then(_item => {
        if (!_item) {
          throw new Error('Order Item not Found')
        }
        resOrderItem = _item
        return Fulfillment.findOne({
          where: {
            order_id: resOrderItem.order_id,
            service: resOrderItem.fulfillment_service
          },
          include: [
            {
              model: OrderItem.instance,
              as: 'order_items'
            }
          ],
          transaction: options.transaction || null
        })
      })
      .then(fulfillment => {
        if (!fulfillment) {
          throw new ModelError('E_NOT_FOUND', 'Fulfillment not found')
        }
        resFulfillment = fulfillment
        return resFulfillment.hasOrder_item(resOrderItem, {transaction: options.transaction || null})
      })
      .then(hasOrderItem => {
        if (hasOrderItem && resOrderItem.quantity === 0) {
          return resFulfillment.removeOrder_item(resOrderItem, {
            hooks: false,
            individualHooks: false,
            returning: false,
            transaction: options.transaction || null
          })
        }
        else {
          return
        }
      })
      .then(() => {
        return resFulfillment.reload({transaction: options.transaction || null})
      })
      .then(() => {
        return resFulfillment.saveFulfillmentStatus({transaction: options.transaction || null})
      })
      .then(() => {
        return this.updateFulfillment(resFulfillment, {transaction: options.transaction || null})
      })
      .then(() => {
        return resOrderItem
      })
  }

  /**
   *
   * @param fulfillment
   * @param options
   * @returns {Promise.<T>}
   */
  manualUpdateFulfillment(fulfillment, options: {[key: string]: any} = {}) {
    const Fulfillment = this.app.models['Fulfillment']
    let resFulfillment
    return Fulfillment.resolve(fulfillment, {transaction: options.transaction || null})
      .then(_fulfillment => {
        if (!_fulfillment) {
          throw new Error('Fulfillment not found')
        }
        resFulfillment = _fulfillment
        return resFulfillment.fulfillUpdate(
          fulfillment,
          {transaction: options.transaction || null}
        )
      })
      .then((_update) => {
        return resFulfillment.save({transaction: options.transaction || null})
      })
  }

  beforeCreate(fulfillment, options) {
    return Promise.resolve(fulfillment)
  }
  beforeUpdate(fulfillment, options) {
    return Promise.resolve(fulfillment)
  }

  /**
   *
   * @param fulfillment
   * @param options
   * @returns {Promise.<TResult>}
   */
  afterCreate(fulfillment, options) {
    return fulfillment.reconcileFulfillmentStatus({transaction: options.transaction || null})
  }

  /**
   *
   * @param fulfillment
   * @param options
   * @returns {Promise.<TResult>}
   */
  afterUpdate(fulfillment, options) {
    return fulfillment.reconcileFulfillmentStatus({transaction: options.transaction || null})
  }

  beforeEventCreate(fulfillment, options) {
    return Promise.resolve(fulfillment)
  }
  beforeEventUpdate(fulfillment, options) {
    return Promise.resolve(fulfillment)
  }

  afterEventCreate(fulfillment, options) {
    return Promise.resolve(fulfillment)
  }
  afterEventUpdate(fulfillment, options) {
    return Promise.resolve(fulfillment)
  }
}

