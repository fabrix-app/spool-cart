import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { isObject, isNumber, isString, map, defaultsDeep, pick } from 'lodash'

export class TagResolver extends SequelizeResolver {
  resolve(tag, options: {[key: string]: any} = {}) {
    const TagModel = this

    if (tag instanceof TagModel.instance) {
      return Promise.resolve(tag)
    }
    else if (tag && isObject(tag) && tag.id) {
      return TagModel.findById(tag.id, options)
        .then(foundTag => {
          if (!foundTag) {
            // TODO create proper error
            throw new ModelError('E_NOT_FOUND', `Tag with ${tag.id} not found`)
          }
          return foundTag
        })
    }
    else if (tag && isObject(tag) && tag.name) {
      return TagModel.findOne({
        where: {
          name: tag.name
        },
        ...options
      })
        .then(resTag => {
          if (resTag) {
            return resTag
          }
          return TagModel.create(tag, options)
        })
    }
    else if (tag && isNumber(tag)) {
      return TagModel.findById(tag, options)
        .then(foundTag => {
          if (!foundTag) {
            // TODO create proper error
            throw new ModelError('E_NOT_FOUND', `Tag with ${tag} not found`)
          }
          return foundTag
        })
    }
    else if (tag && isString(tag)) {
      return TagModel.findOne(defaultsDeep({
        where: {
          name: tag,
        }
      }, options))
        .then(resTag => {
          if (resTag) {
            return resTag
          }
          return TagModel.create({name: tag})
        })
    }
    else {
      // TODO make Proper Error
      const err = new Error(`Not able to resolve tag ${tag}`)
      return Promise.reject(err)
    }
  }
  /**
   *
   * @param tags
   * @param options
   * @returns {Promise.<*>}
   */
  transformTags (tags = [], options: {[key: string]: any} = {}) {
    const TagModel = this
    const Sequelize = TagModel.sequelize

    // Transform tag to object if necessary.
    tags = tags.map(tag => {
      if (tag && isNumber(tag)) {
        return { id: tag }
      }
      else if (tag && isString(tag)) {
        tag = {
          name: this.app.services.ProxyCartService.name(tag)
        }
        return tag
      }
      else if (tag && isObject(tag) && tag.name ) {
        tag.name = this.app.services.ProxyCartService.name(tag.name)
        return tag
      }
    })
    // Filter out undefined
    tags = tags.filter(tag => tag)
      return Sequelize.Promise.mapSeries(tags, tag => {
        const newTag = tag
        return TagModel.findOne({
          where: pick(tag, ['id', 'name']),
          attributes: ['id', 'name'],
          transaction: options.transaction || null
        })
        .then(_tag => {
          if (_tag) {
            return _tag
          }
          else {
            return TagModel.create(newTag, {
              transaction: options.transaction || null
            })
          }
        })
    })
  }

  /**
   *
   */
  reverseTransformTags (tags) {
    tags = map(tags, tag => {
      if (tag && isString(tag)) {
        return tag
      }
      else if (tag && tag.name) {
        return tag.name
      }
    })
    return tags
  }
}

/**
 * @module Tag
 * @description Tag Model
 */
export class Tag extends Model {

  static get resolver() {
    return TagResolver
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
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // The Tag Name
      name: {
        type: Sequelize.STRING,
        // primaryKey: true,
        // allowNull: false,
        unique: true,
        notNull: true,
        set: function(val) {
          this.setDataValue('name', app.services.ProxyCartService.name(val))
        }
      },

      // Live Mode
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
    models.Tag.belongsToMany(models.Product, {
      as: 'products',
      through: {
        model: models.ItemTag,
        unique: false,
        scope: {
          model: 'product'
        }
      },
      foreignKey: 'tag_id',
      otherKey: 'model_id',
      constraints: false
    })
    models.Tag.belongsToMany(models.Customer, {
      as: 'customers',
      through: {
        model: models.ItemTag,
        unique: false,
        scope: {
          model: 'customer'
        }
      },
      foreignKey: 'tag_id',
      otherKey: 'model_id',
      constraints: false
    })
    models.Tag.belongsToMany(models.Collection, {
      as: 'collections',
      through: {
        model: models.ItemTag,
        unique: false,
        scope: {
          model: 'collection'
        }
      },
      foreignKey: 'tag_id',
      otherKey: 'model_id',
      constraints: false
    })
  }
}
