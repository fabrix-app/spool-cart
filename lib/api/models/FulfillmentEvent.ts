import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { isObject, isString, isNumber, values } from 'lodash'
import { FULFILLMENT_EVENT_STATUS } from '../../enums'

export class FulfillmentEventResolver extends SequelizeResolver {
  /**
   * Resolve by instance Function
   * @param fulfillmentEvent
   * @param options
   */
  resolveByInstance (fulfillmentEvent, options: {[key: string]: any} = {}) {
    return Promise.resolve(fulfillmentEvent)
  }
  /**
   * Resolve by id Function
   * @param fulfillmentEvent
   * @param options
   */
  resolveById (fulfillmentEvent, options: {[key: string]: any} = {}) {
    return this.findById(fulfillmentEvent.id, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `FulfillmentEvent ${fulfillmentEvent.id} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by number Function
   * @param fulfillmentEvent
   * @param options
   */
  resolveByNumber (fulfillmentEvent, options: {[key: string]: any} = {}) {
    return this.findById(fulfillmentEvent, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `FulfillmentEvent ${fulfillmentEvent.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by string Function
   * @param fulfillmentEvent
   * @param options
   */
  resolveByString (fulfillmentEvent, options: {[key: string]: any} = {}) {
    return this.findOne(this.app.services.SequelizeService.mergeOptionDefaults(options, {
      where: {
        code: fulfillmentEvent
      }
    }))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `FulfillmentEvent ${fulfillmentEvent} not found`)
        }
        return resUser
      })
  }
  /**
   * Primary Resolve Function
   * @param fulfillmentEvent
   * @param options
   */
  resolve(fulfillmentEvent, options: {[key: string]: any} = {}) {
    const resolvers = {
      'instance': fulfillmentEvent instanceof this.instance,
      'id': !!(fulfillmentEvent && isObject(fulfillmentEvent) && fulfillmentEvent.id),
      'number': !!(fulfillmentEvent && isNumber(fulfillmentEvent)),
      'string': !!(fulfillmentEvent && isString(fulfillmentEvent))
    }
    const type = Object.keys(resolvers).find((key) => resolvers[key])

    switch (type) {
      case 'instance': {
        return this.resolveByInstance(fulfillmentEvent, options)
      }
      case 'id': {
        return this.resolveById(fulfillmentEvent, options)
      }
      case 'number': {
        return this.resolveByNumber(fulfillmentEvent, options)
      }
      case 'string': {
        return this.resolveByString(fulfillmentEvent, options)
      }
      default: {
        // TODO create proper error
        const err = new Error(`Unable to resolve FulfillmentEvent ${fulfillmentEvent}`)
        return Promise.reject(err)
      }
    }
  }
}

/**
 * @module FulfillmentEvent
 * @description Fulfillment Event Model
 */
export class FulfillmentEvent extends Model {

  static get resolver() {
    return FulfillmentEventResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        hooks: {
          beforeCreate: [
            (fulfillmentEvent, options) => {
              return app.services.FulfillmentService.beforeEventCreate(fulfillmentEvent, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          beforeUpdate: [
            (fulfillmentEvent, options) => {
              return app.services.FulfillmentService.beforeEventUpdate(fulfillmentEvent, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          afterCreate: [
            (fulfillmentEvent, options) => {
              return app.services.FulfillmentService.afterEventCreate(fulfillmentEvent, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          afterUpdate: [
            (fulfillmentEvent, options) => {
              return app.services.FulfillmentService.afterEventUpdate(fulfillmentEvent, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ]
        },
        enums: {
          FULFILLMENT_EVENT_STATUS: FULFILLMENT_EVENT_STATUS
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      fulfillment_id: {
        type: Sequelize.INTEGER,
        notNull: true
      },
      status: {
        type: Sequelize.ENUM,
        values: values(FULFILLMENT_EVENT_STATUS)
      },
      message: {
        type: Sequelize.STRING
      },
      address_1: {
        type: Sequelize.STRING
      },
      province: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      postal_code: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      longitude: {
        type: Sequelize.FLOAT
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.FulfillmentEvent.belongsTo(models.Fulfillment, {
      foreignKey: 'fulfillment_id'
    })
  }
}
