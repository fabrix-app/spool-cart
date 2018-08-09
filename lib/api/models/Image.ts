import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { isObject, isString, isNumber } from 'lodash'


export class ImageResolver extends SequelizeResolver {
  // TODO
  resolve (image, options) {
    return Promise.resolve(image)
  }

  transformImages (images = [], options: {[key: string]: any} = {}) {
    const ImageModel = this.app.models['Image']
    const Sequelize = ImageModel.sequelize

    return Sequelize.Promise.mapSeries(images, image => {
      if (image instanceof ImageModel.instance) {
        return Promise.resolve(image)
      }
      else if (image && image.id) {
        return ImageModel.findById(image.id, {transaction: options.transaction || null})
          .then(_image => {
            if (!_image) {
              throw new Error('Image Could not be resolved')
            }
            return _image
          })
      }
      else if (image && image.id) {
        return ImageModel.findById(image.id, {transaction: options.transaction || null})
          .then(_image => {
            if (!_image) {
              throw new Error('Image Could not be resolved to create')
            }
            return _image
          })
      }
      else if (image && isObject(image)) {
        return ImageModel.create(image, {transaction: options.transaction || null})
          .then(_image => {
            if (!_image) {
              throw new Error('ImageModel Could not be resolved to create')
            }
            return _image
          })
      }
      else if (image && isNumber(image)) {
        return ImageModel.findById(image, {transaction: options.transaction || null})
          .then(_image => {
            if (!_image) {
              throw new Error('Image Could not be resolved')
            }
            return _image
          })
      }
      else if (image && isString(image)) {
        return ImageModel.create({ src: image}, {transaction: options.transaction || null})
          .then(_image => {
            if (!_image) {
              throw new Error('Image Could not be resolved to create')
            }
            return _image
          })
      }
      else {
        // TODO create proper error
        const err = new Error(`Unable to resolve ImageModel ${image}`)
        return Promise.reject(err)
      }
    })
  }
}

/**
 * @module Image
 * @description Image Model
 */
export class Image extends Model {
  static get resolver() {
    return ImageResolver
  }

  // TODO, after create download and parse
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
        hooks: {
          beforeCreate: [
            (values, options) => {
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
          ]
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

      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('engine.live_mode')
      }
    }
  }

  public static associate (models) {
    // models.Image.belongsToMany(models.Product, {
    //   as: 'products',
    //   through: {
    //     model: models.ItemImage,
    //     unique: false,
    //     scope: {
    //       model: 'product'
    //     }
    //   },
    //   foreignKey: 'image_id',
    //   constraints: false
    // })
    // models.Image.belongsToMany(models.ProductVariant, {
    //   as: 'variants',
    //   through: {
    //     model: models.ItemImage,
    //     unique: false,
    //     scope: {
    //       model: 'productvariant'
    //     }
    //   },
    //   foreignKey: 'image_id',
    //   constraints: false
    // })
    models.Image.belongsToMany(models.Collection, {
      as: 'collections',
      through: {
        model: models.ItemImage,
        unique: false,
        scope: {
          model: 'collection'
        }
      },
      foreignKey: 'image_id',
      constraints: false
    })
  }
}
