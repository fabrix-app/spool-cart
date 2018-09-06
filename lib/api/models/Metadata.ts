import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

export class MetadataResolver extends SequelizeResolver {
  /**
   *
   */
  transform (metadata) {
    if (typeof metadata.data !== 'undefined') {
      return metadata
    }
    return { data: metadata }
  }

  /**
   *
   */
  reverseTransform (metadata) {
    if (typeof metadata.data !== 'undefined') {
      return metadata.data
    }
    return metadata
  }
}
/**
 * @module Metadata
 * @description Metadata Model
 */
export class Metadata extends Model {

  static get resolver() {
    return MetadataResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        scopes: {
          live: {
            where: {
              live_mode: true
            }
          }
        },
        indexes: [
          // Creates a gin index on data with the jsonb_path_ops operator
          {
            fields: ['data'],
            using: 'gin',
            operator: 'jsonb_path_ops'
          }
        ]
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // model: {
      //   type: Sequelize.STRING,
      //   // unique: 'metadata_model'
      // },
      // model_id: {
      //   type: Sequelize.INTEGER,
      //   // unique: 'metadata_model',
      //   // references: null
      // },
      data: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('Metadata', app, Sequelize, 'data', {
      //   defaultValue: {}
      // }),
      customer_id: {
        type: Sequelize.INTEGER
      },
      collection_id: {
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      product_variant_id: {
        type: Sequelize.INTEGER
      },
      product_review_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      order_item_id: {
        type: Sequelize.INTEGER
      },
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('cart.live_mode')
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  // TODO associate Metadata with product variant as well.
  public static associate (models) {
    // models.Metadata.belongsTo(models.Product, {
    //   scope: {
    //     model: 'product'
    //   },
    //   foreignKey: 'model_id',
    //   constraints: false
    // })
    // models.Metadata.belongsTo(models.ProductVariant, {
    //   scope: {
    //     model: 'product_variant'
    //   },
    //   foreignKey: 'model_id',
    //   constraints: false
    // })
    // models.Metadata.belongsTo(models.Customer, {
    //   scope: {
    //     model: 'customer'
    //   },
    //   foreignKey: 'model_id',
    //   constraints: false
    // })
    // models.Metadata.belongsTo(models.User, {
    //   scope: {
    //     model: 'user'
    //   },
    //   foreignKey: 'id',
    //   constraints: false
    // })
    // models.Metadata.belongsTo(models.Product, {
    //   through: {
    //     model: models.ItemMetadata,
    //     unique: false
    //   },
    //   foreignKey: 'meta_id',
    //   constraints: false
    // })
    // models.Metadata.belongsTo(models.Customer, {
    //   through: {
    //     model: models.ItemMetadata,
    //     unique: false
    //   },
    //   foreignKey: 'meta_id',
    //   constraints: false
    // })
    // models.Metadata.belongsTo(models.Customer, {
    //   // as: 'customer_id'
    // })
    // models.Metadata.belongsTo(models.Product, {
    //   // as: 'customer_id'
    // })
    // models.Metadata.belongsTo(models.ProductCollection, {
    //   // as: 'customer_id'
    // })
  }
}
