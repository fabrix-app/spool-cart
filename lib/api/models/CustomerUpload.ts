import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

import { CUSTOMER_STATE } from '../../enums'
import { values } from 'lodash'

export class CustomerUploadResolver extends SequelizeResolver {
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
 * @module CustomerUpload
 * @description Customer Upload Model
 */
export class CustomerUpload extends Model {

  static get resolver() {
    return CustomerUploadResolver
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
      // Account Balance
      account_balance: {
        type: Sequelize.INTEGER
      },
      // email
      email: {
        type: Sequelize.STRING
      },
      // First Name
      first_name: {
        type: Sequelize.STRING
      },
      // Last Name
      last_name: {
        type: Sequelize.STRING
      },
      // Company
      company: {
        type: Sequelize.STRING
      },
      // Phone
      phone: {
        type: Sequelize.STRING
      },
      // Line 1
      shipping_address_1: {
        type: Sequelize.STRING
      },
      // Line 2
      shipping_address_2: {
        type: Sequelize.STRING
      },
      // Line 3
      shipping_address_3: {
        type: Sequelize.STRING
      },
      // Company
      shipping_company: {
        type: Sequelize.STRING
      },
      // City
      shipping_city: {
        type: Sequelize.STRING
      },
      // Province/State abbr
      shipping_province: {
        type: Sequelize.STRING
      },
      // Country Code iso-alpha-2
      shipping_country: {
        type: Sequelize.STRING
      },
      // Postal/Zip Code
      shipping_postal_code: {
        type: Sequelize.STRING
      },

      // Line 1
      billing_address_1: {
        type: Sequelize.STRING
      },
      // Line 2
      billing_address_2: {
        type: Sequelize.STRING
      },
      // Line 3
      billing_address_3: {
        type: Sequelize.STRING
      },
      // Company
      billing_company: {
        type: Sequelize.STRING
      },
      // City
      billing_city: {
        type: Sequelize.STRING
      },
      // Province/State abbr
      billing_province: {
        type: Sequelize.STRING
      },
      // Country Code iso-alpha-2
      billing_country: {
        type: Sequelize.STRING
      },
      // Postal/Zip Code
      billing_postal_code: {
        type: Sequelize.STRING
      },

      state: {
        type: Sequelize.ENUM,
        values: values(CUSTOMER_STATE),
        defaultValue: CUSTOMER_STATE.ENABLED
      },

      type: {
        type: Sequelize.STRING,
        defaultValue: 'default'
      },

      // 'Collections'
      collections: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('CustomerUpload', app, Sequelize, 'collections', {
      //   defaultValue: []
      // }),
      // 'Tags'
      tags: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('CustomerUpload', app, Sequelize, 'tags', {
      //   defaultValue: []
      // }),
      // 'Accounts'
      accounts: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('CustomerUpload', app, Sequelize, 'accounts', {
      //   defaultValue: []
      // }),
      // 'Users'
      users: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('CustomerUpload', app, Sequelize, 'users', {
      //   defaultValue: []
      // }),
      // 'Discounts'
      discounts: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('CustomerUpload', app, Sequelize, 'discounts', {
      //   defaultValue: []
      // }),
      // 'Image'
      image: {
        type: Sequelize.STRING
      },
      // 'Image Alt'
      image_alt: {
        type: Sequelize.STRING
      }
    }
  }
}
