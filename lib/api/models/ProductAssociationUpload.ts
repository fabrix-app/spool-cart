import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

// tslint:disable:no-shadowed-variable
export class ProductAssociationUploadResolver extends SequelizeResolver {
  batch(options, batch) {
    const self = this

    options.limit = options.limit || 100
    options.offset = options.offset || 0
    options.regressive = options.regressive || false

    const recursiveQuery = function (options) {
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
 * @module ProductAssociationUpload
 * @description Product Meta Upload
 */
export class ProductAssociationUpload extends Model {

  static get resolver() {
    return ProductAssociationUploadResolver
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
      product_handle: {
        type: Sequelize.STRING,
        allowNull: false,
        set: function(val) {
          this.setDataValue('product_handle', app.services.ProxyCartService.handle(val))
        }
      },
      product_sku: {
        type: Sequelize.STRING,
        allowNull: true,
        set: function(val) {
          this.setDataValue('product_sku', app.services.ProxyCartService.sku(val))
        }
      },
      associated_product_handle: {
        type: Sequelize.STRING,
        allowNull: false,
        set: function(val) {
          this.setDataValue('associated_product_handle', app.services.ProxyCartService.handle(val))
        }
      },
      associated_product_sku: {
        type: Sequelize.STRING,
        allowNull: true,
        set: function(val) {
          this.setDataValue('associated_product_sku', app.services.ProxyCartService.sku(val))
        }
      },
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('cart.live_mode')
      }
    }
  }

  public static associate (models) {
    // models.ProductAssociationUpload.belongsTo(models.Product, {
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
