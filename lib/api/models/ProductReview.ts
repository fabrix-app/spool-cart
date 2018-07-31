import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { FabrixApp } from '@fabrix/fabrix'

/**
 * @module ProductReview
 * @description Product Review Model
 */
export class ProductReview extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        classMethods: {
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // The ID of the customer who Reviewed
      customer_id: {
        type: Sequelize.INTEGER
      },
      // The ID of the user who reviewed
      user_id: {
        type: Sequelize.INTEGER
      },
      // The ID of the product Reviewed
      product_id: {
        type: Sequelize.INTEGER
      },
      // The ID of the product Reviewed
      variant_id: {
        type: Sequelize.INTEGER
      },
      // The ID of the metadata Reviewed
      metadata_id: {
        type: Sequelize.INTEGER
      },
      // The Score of the Review
      score: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The Review
      review: {
        type: Sequelize.TEXT
      },

      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('engine.live_mode')
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.ProductReview.belongsTo(models.Customer, {
      // as: 'customer_id'
    })
    models.ProductReview.belongsTo(models.Product, {
      // as: 'product_id'
    })
    models.ProductReview.belongsTo(models.ProductVariant, {
      foreignKey: 'variant_id'
      // as: 'product_id'
    })
    models.ProductReview.belongsTo(models.User, {
      // as: 'product_id'
    })
    models.ProductReview.hasOne(models.Metadata, {
      as: 'metadata',
      foreignKey: 'product_review_id'
      // through: {
      //   model: models.ItemMetadata,
      //   unique: false,
      //   scope: {
      //     model: 'review'
      //   },
      //   foreignKey: 'model_id',
      //   constraints: false
      // }
    })
  }
}

export interface ProductReview {
  resolveMetadata(app, options): any
}

/**
 *
 */
ProductReview.prototype.resolveMetadata = function(app: FabrixApp, options: {[key: string]: any} = {}) {
  if (
    this.metadata
    && this.metadata instanceof app.models['Metadata'].instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getMetadata({transaction: options.transaction || null})
      .then(_metadata => {
        _metadata = _metadata || {product_review_id: this.id}
        this.metadata = _metadata
        this.setDataValue('metadata', _metadata)
        this.set('metadata', _metadata)
        return this
      })
  }
}
