import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { values } from 'lodash'
import { COLLECTION_SORT_ORDER } from '../../enums'
import { COLLECTION_PURPOSE } from '../../enums'
import { COLLECTION_DISCOUNT_SCOPE } from '../../enums'
import { COLLECTION_DISCOUNT_TYPE } from '../../enums'
import { COLLECTION_TAX_TYPE } from '../../enums'
import { COLLECTION_SHIPPING_TYPE } from '../../enums'

export class CollectionUploadResolver extends SequelizeResolver {
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
 * @module CollectionUpload
 * @description Collection Upload Model
 */
export class CollectionUpload extends Model {

  static get resolver() {
    return CollectionUploadResolver
  }

  static config (app, Sequelize) {
    return {
      // migrate: 'drop', //override default models configurations if needed
      // store: 'uploads',
      options: {
        underscored: true,
        enums: {
          COLLECTION_PURPOSE: COLLECTION_PURPOSE,
          COLLECTION_SORT_ORDER: COLLECTION_SORT_ORDER,
          COLLECTION_DISCOUNT_SCOPE: COLLECTION_DISCOUNT_SCOPE,
          COLLECTION_DISCOUNT_TYPE: COLLECTION_DISCOUNT_TYPE,
          COLLECTION_TAX_TYPE: COLLECTION_TAX_TYPE,
          COLLECTION_SHIPPING_TYPE: COLLECTION_SHIPPING_TYPE,
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // Upload ID
      upload_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      handle: {
        type: Sequelize.STRING,
        allowNull: false,
        set: function(val) {
          this.setDataValue('handle', app.services.ProxyCartService.handle(val))
        }
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        set: function(val) {
          this.setDataValue('title', app.services.ProxyCartService.title(val))
        }
      },
      description: {
        type: Sequelize.TEXT
      },
      // 'SEO Title'
      seo_title: {
        type: Sequelize.STRING,
        set: function(val) {
          this.setDataValue('seo_title', app.services.ProxyCartService.title(val))
        }
      },
      // 'SEO Description'
      seo_description: {
        type: Sequelize.STRING,
        set: function(val) {
          this.setDataValue('seo_description', app.services.ProxyCartService.description(val))
        }
      },
      excerpt: {
        type: Sequelize.TEXT
      },
      body: {
        type: Sequelize.TEXT
      },
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      primary_purpose: {
        type: Sequelize.ENUM,
        values: values(COLLECTION_PURPOSE),
        defaultValue: COLLECTION_PURPOSE.GROUP
      },
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      sort_order: {
        type: Sequelize.ENUM,
        values: values(COLLECTION_SORT_ORDER),
        defaultValue: COLLECTION_SORT_ORDER.ALPHA_DESC
      },
      tax_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      tax_percentage: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      tax_type: {
        type: Sequelize.ENUM,
        values: values(COLLECTION_TAX_TYPE),
        defaultValue: COLLECTION_TAX_TYPE.PERCENTAGE
      },
      tax_name: {
        type: Sequelize.STRING
      },
      shipping_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      shipping_percentage: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      shipping_type: {
        type: Sequelize.ENUM,
        values: values(COLLECTION_SHIPPING_TYPE),
        defaultValue: COLLECTION_SHIPPING_TYPE.PERCENTAGE
      },
      shipping_name: {
        type: Sequelize.STRING
      },
      discount_scope: {
        type: Sequelize.ENUM,
        values: values(COLLECTION_DISCOUNT_SCOPE),
        defaultValue: COLLECTION_DISCOUNT_SCOPE.INDIVIDUAL
      },
      discount_type: {
        type: Sequelize.ENUM,
        values: values(COLLECTION_DISCOUNT_TYPE),
        defaultValue: COLLECTION_DISCOUNT_TYPE.PERCENTAGE
      },
      discount_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      discount_percentage: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      // List of product types allowed to discount
      discount_product_include: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('CollectionUpload', app, Sequelize, 'discount_product_include', {
      //   defaultValue: []
      // }),
      // List of product types to forcefully excluded from discount
      discount_product_exclude: {
        type: Sequelize.JSONB,
        defaultValue: []
      },

      //   helpers.JSONB('CollectionUpload', app, Sequelize, 'discount_product_exclude', {
      //   defaultValue: []
      // }),
      images: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('CollectionUpload', app, Sequelize, 'images', {
      //   defaultValue: []
      // }),
      collections: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('CollectionUpload', app, Sequelize, 'collections', {
      //   defaultValue: []
      // }),
      discounts: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   : helpers.JSONB('CollectionUpload', app, Sequelize, 'discounts', {
      //   defaultValue: []
      // }),
      // 'Tags'
      tags: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   : helpers.JSONB('CollectionUpload', app, Sequelize, 'tags', {
      //   defaultValue: []
      // }),
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('cart.live_mode')
      }
    }
  }
}
