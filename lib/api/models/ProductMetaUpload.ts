import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

// tslint:disable:no-shadowed-variable
export class ProductMetaUploadResolver extends SequelizeResolver {
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
 * @module ProductMetaUpload
 * @description Product Meta Upload
 */
export class ProductMetaUpload extends Model {

  public static get resolver() {
    return ProductMetaUploadResolver
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
      upload_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // This handle can be <product_handle:sku> in which case it might be larger than 255
      handle: {
        type: Sequelize.STRING(500),
        allowNull: false,
        set: function(val) {
          this.setDataValue('handle', app.services.ProxyCartService.splitHandle(val) || null)
        }
        // references: {
        //   model: 'Product',
        //   key: 'handle'
        // }
      },
      data: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      //   helpers.JSONB('ProductMetaUpload', app, Sequelize, 'data', {
      //   defaultValue: {}
      // }),
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('cart.live_mode')
      }
    }
  }


  public static associate (models) {
    // models.ProductMetaUpload.belongsTo(models.Product, {
    //   as: 'handle',
    //   // targetKey: 'handle',
    //   foreignKey: 'handle',
    //   onDelete: 'CASCADE'
    //   // foreignKey: {
    //   //   allowNull: true
    //   // }
    // })
  }
}
