import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

export class OrderUploadResolver extends SequelizeResolver {
  batch(options, batch) {
    const self = this

    options.limit = options.limit || 100
    options.offset = options.offset || 0

    const recursiveQuery = function(opts) {
      let count = 0
      return self.findAndCountAll(opts)
        .then(results => {
          count = results.count
          return batch(results.rows)
        })
        .then(batched => {
          if (count > opts.offset + opts.limit) {
            opts.offset = opts.offset + opts.limit
            return recursiveQuery(opts)
          }
          else {
            return batched
          }
        })
    }
    return recursiveQuery(options)
  }
}

/**
 * @module OrderUpload
 * @description Order Upload
 */
export class OrderUpload extends Model {

  static get resolver() {
    return OrderUploadResolver
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
      // Customer: customer email
      customer: {
        type: Sequelize.STRING
      },
      // Email
      email: {
        type: Sequelize.STRING
      },
      // Status
      status: {
        type: Sequelize.STRING
      },
      // Order Items
      order_items: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('OrderUpload', app, Sequelize, 'order_items', {
      //   defaultValue: []
      // }),
      // Shipping Line 1
      shipping_address_1: {
        type: Sequelize.STRING
      },
      // Shipping Line 2
      shipping_address_2: {
        type: Sequelize.STRING
      },
      // Shipping Line 3
      shipping_address_3: {
        type: Sequelize.STRING
      },
      // Shipping Company
      shipping_company: {
        type: Sequelize.STRING
      },
      // Shipping City
      shipping_city: {
        type: Sequelize.STRING
      },
      // Shipping Province/State abbr
      shipping_province: {
        type: Sequelize.STRING
      },
      // Shipping Country Code iso-alpha-2
      shipping_country: {
        type: Sequelize.STRING
      },
      // Shipping Postal/Zip Code
      shipping_postal_code: {
        type: Sequelize.STRING
      },

      // Billing Line 1
      billing_address_1: {
        type: Sequelize.STRING
      },
      // Billing Line 2
      billing_address_2: {
        type: Sequelize.STRING
      },
      // Billing Line 3
      billing_address_3: {
        type: Sequelize.STRING
      },
      // Billing Company
      billing_company: {
        type: Sequelize.STRING
      },
      // Billing City
      billing_city: {
        type: Sequelize.STRING
      },
      // Billing Province/State abbr
      billing_province: {
        type: Sequelize.STRING
      },
      // Billing Country Code iso-alpha-2
      billing_country: {
        type: Sequelize.STRING
      },
      // Billing Postal/Zip Code
      billing_postal_code: {
        type: Sequelize.STRING
      },
      // 'Tags'
      tags: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      //   helpers.JSONB('OrderUpload', app, Sequelize, 'tags', {
      //   defaultValue: []
      // }),
      // Note
      note: {
        type: Sequelize.TEXT
      }
    }
  }
}
