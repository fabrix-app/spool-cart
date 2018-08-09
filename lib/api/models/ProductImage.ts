import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { isObject, isString, isNumber } from 'lodash'

export class ProductImageResolver extends SequelizeResolver {
  resolve(image, options: {[key: string]: any} = {}) {
    const Image =  this

    if (image instanceof Image.instance) {
      return Promise.resolve(image)
    }
    else if (image && isObject(image) && image.id) {
      return Image.findById(image.id, options)
        .then(resImage => {
          if (!resImage && options.reject !== false) {
            throw new ModelError('E_NOT_FOUND', `Image id ${image.id} not found`)
          }
          return resImage || image
        })
    }
    else if (image && isObject(image) && image.src) {
      return Image.findOne(this.app.services.SequelizeService.mergeOptionDefaults({
        where: {
          src: image.src
        }
      }, options))
        .then(resImage => {
          if (!resImage && options.reject !== false) {
            throw new ModelError('E_NOT_FOUND', `Image src ${image.src} not found`)
          }
          return resImage || image
        })
    }
    else if (image && isNumber(image)) {
      return Image.findById(image, options)
        .then(resImage => {
          if (!resImage && options.reject !== false) {
            throw new ModelError('E_NOT_FOUND', `Image id ${image} not found`)
          }
          return resImage || image
        })
    }
    else if (image && isString(image)) {
      return Image.findOne(this.app.services.SequelizeService.mergeOptionDefaults({
        options,
        where: { src: image }
      }))
        .then(resImage => {
          if (!resImage && options.reject !== false) {
            throw new ModelError('E_NOT_FOUND', `Image src ${image} not found`)
          }
          return resImage || image
        })
    }
    else {
      if (options.reject !== false) {
        // TODO create proper error
        const err = new Error(`Unable to resolve Image ${image}`)
        return Promise.reject(err)
      }
      else {
        return Promise.resolve(image)
      }
    }
  }
}

/**
 * @module ProductImage
 * @description Product Image Model
 */
export class ProductImage extends Model {

  static get resolver() {
    return ProductImageResolver
  }

  // TODO, after create download and parse
  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        hooks: {
          beforeCreate: (values, options) => {
            return app.services.ProxyCartService.buildImages(values.src, options)
              .then(sizes => {
                values.full = sizes.full
                values.thumbnail = sizes.thumbnail
                values.small = sizes.small
                values.medium = sizes.medium
                values.large = sizes.large

              })
              .catch(err => {
                return values
              })

          }
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // The original source
      src: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Unaltered (raw) Image
      full: {
        type: Sequelize.STRING
      },
      // Thumbnail sized image
      thumbnail: {
        type: Sequelize.STRING
      },
      // Small Image URL
      small: {
        type: Sequelize.STRING
      },
      // Medium Image URL
      medium: {
        type: Sequelize.STRING
      },
      // Large Image URL
      large: {
        type: Sequelize.STRING
      },
      // Image Alt Text (Description)
      alt: {
        type: Sequelize.STRING,
        set: function(val) {
          this.setDataValue('alt', app.services.ProxyCartService.description(val))
        }
      },
      // The order of the image in the list of images.
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },

      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('engine.live_mode')
      }
    }
  }

  public static associate (models) {
    models.ProductImage.belongsTo(models.Product, {
      // as: 'product_id',
      // foreignKey: 'product_id',
      onDelete: 'CASCADE'
      // foreignKey: {
      //   allowNull: true
      // }
    })
    models.ProductImage.belongsTo(models.ProductVariant, {
      // foreignKey: 'variant_id',
      onDelete: 'CASCADE'
      // foreignKey: {
      //   allowNull: true
      // }
    })
  }
}
