import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { INTERVALS } from '../../enums'

// const SUBSCRIPTION_CANCEL = require('../../lib').Enums.SUBSCRIPTION_CANCEL

// tslint:disable:no-shadowed-variable
export class SubscriptionUploadResolver extends SequelizeResolver {
  batch(options, batch) {
    const self = this

    options.limit = options.limit || 100
    options.offset = options.offset || 0
    options.regressive = options.regressive || false

    const recursiveQuery = function(options) {
      let count = 0
      return self.findAndCountAll(options)
        .then(results => {
          count = results.count
          return batch(results.rows)
        })
        .then(batched => {
          if (count >= (options.regressive ? options.limit : options.offset + options.limit)) {
            options.offset = options.regressive ? 0 : options.offset + options.limit
            return recursiveQuery(options)
          }
          else {
            return Promise.resolve()
          }
        })
    }
    return recursiveQuery(options)
  }
}

/**
 * @module SubscriptionUpload
 * @description Subscription Upload Model
 */
export class SubscriptionUpload extends Model {

  static get resolver() {
    return SubscriptionUploadResolver
  }

  static config (app, Sequelize) {
    return {
      // migrate: 'drop', //override default models configurations if needed
      // store: 'uploads',
      options: {
        underscored: true
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // Upload ID
      upload_id: {
        type: Sequelize.STRING
      },
      // Token: prior subscription token
      token: {
        type: Sequelize.STRING
      },
      // Customer: customer email
      customer: {
        type: Sequelize.STRING
      },

      // The interval of the subscription, defaults to 1 months
      interval: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      // The unit of the interval
      unit: {
        type: Sequelize.ENUM,
        values: Object.values(INTERVALS),
        defaultValue: INTERVALS.MONTH
      },
      // Active Subscription
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      // Products
      products: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('SubscriptionUpload', app, Sequelize, 'products', {
      //   defaultValue: []
      // }),
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('cart.live_mode')
      }
    }
  }
}
