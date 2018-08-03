import { FabrixApp } from '@fabrix/fabrix'
import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { isObject, isString, isNumber, defaultsDeep, pick, extend, values } from 'lodash'

const queryDefaults = require('../utils/queryDefaults')
import { COLLECTION_SORT_ORDER } from '../../enums'
import { COLLECTION_PURPOSE } from '../../enums'
import { COLLECTION_DISCOUNT_SCOPE } from '../../enums'
import { COLLECTION_DISCOUNT_TYPE } from '../../enums'
import { COLLECTION_TAX_TYPE } from '../../enums'
import { COLLECTION_SHIPPING_TYPE } from '../../enums'

export class CollectionResolver extends SequelizeResolver {
  findByIdDefault(id, options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      queryDefaults.Collection.default(this.app),
      options
    )
    return this.findById(id, options)
  }
  findByHandleDefault(handle, options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      queryDefaults.Collection.default(this.app),
      {
        where: {
          handle: handle
        }
      },
      options
    )
    return this.findOne(options)
  }
  findOneDefault(options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      queryDefaults.Collection.default(this.app),
      options
    )
    return this.findOne(options)
  }

  findAllDefault(options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      queryDefaults.Collection.default(this.app),
      options
    )
    return this.findAll(options)
  }

  findAndCountDefault(options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      queryDefaults.Collection.findAndCountDefault(this.app),
      options
    )
    return this.findAndCountAll(options)
  }

  /**
   * Resolve by instance Function
   * @param collection
   * @param options
   */
  resolveByInstance (collection, options: {[key: string]: any} = {}) {
    return Promise.resolve(collection)
  }
  /**
   * Resolve by id Function
   * @param collection
   * @param options
   */
  resolveById (collection, options: {[key: string]: any} = {}) {
    return this.findById(collection.id, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Collection ${collection.id} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by handle Function
   * @param collection
   * @param options
   */
  resolveByHandle (collection, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        handle: collection.handle
      }
    }, options))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Collection handle ${collection.handle} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by number Function
   * @param collection
   * @param options
   */
  resolveByNumber (collection, options: {[key: string]: any} = {}) {
    return this.findById(collection, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Collection ${collection.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by string Function
   * @param collection
   * @param options
   */
  resolveByString (collection, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        token: collection
      }
    }, options))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Collection ${collection} not found`)
        }
        return resUser
      })
  }
  // TODO, enable
  // /**
  //  * Primary Resolve Function
  //  * @param collection
  //  * @param options
  //  */
  // resolve(collection, options: {[key: string]: any} = {}) {
  //   const resolvers = {
  //     'instance': collection instanceof this.instance,
  //     'id': !!(collection && isObject(collection) && collection.id),
  //     'handle': !!(collection && isObject(collection) && collection.handle),
  //     'number': !!(collection && isNumber(collection)),
  //     'string': !!(collection && isString(collection))
  //   }
  //   const type = Object.keys(resolvers).find((key) => resolvers[key])
  //
  //   switch (type) {
  //     case 'instance': {
  //       return this.resolveByInstance(collection, options)
  //     }
  //     case 'id': {
  //       return this.resolveById(collection, options)
  //     }
  //     case 'handle': {
  //       return this.resolveByHandle(collection, options)
  //     }
  //     case 'number': {
  //       return this.resolveByNumber(collection, options)
  //     }
  //     case 'string': {
  //       return this.resolveByString(collection, options)
  //
  //     }
  //     default: {
  //       // TODO create proper error
  //       const err = new Error(`Unable to resolve Collection ${collection}`)
  //       return Promise.reject(err)
  //     }
  //   }
  // }
  /**
   *
   * @param collection
   * @param options
   * @returns {*}
   */
  resolve(collection, options: {[key: string]: any} = {}) {
    const CollectionModel = this
    if (collection instanceof CollectionModel.instance) {
      return Promise.resolve(collection)
    }
    else if (collection && isObject(collection) && collection.id) {
      return CollectionModel.findById(collection.id, options)
        .then(foundCollection => {
          if (!foundCollection) {
            throw new ModelError('E_NOT_FOUND', `Collection ${collection.id} not found`)
          }
          return foundCollection
        })
    }
    else if (collection && isObject(collection) && collection.handle) {
      return CollectionModel.findOne(this.app.services.SequelizeService.mergeOptionDefaults(
        options,
        {
          where: {
            handle: collection.handle
          }
        }
        )
      )
        .then(resCollection => {
          if (resCollection) {
            return resCollection
          }
          collection.title = collection.title || collection.handle
          return this.app.services.CollectionService.create(collection, {transaction: options.transaction})
        })
    }
    else if (collection && isObject(collection) && collection.title) {
      return CollectionModel.findOne(options = this.app.services.SequelizeService.mergeOptionDefaults(
        options,
        {
          where: {
            handle: this.app.services.ProxyCartService.handle(collection.title)
          }
        }
        )
      )
        .then(resCollection => {
          if (resCollection) {
            return resCollection
          }
          collection.handle = collection.handle || this.app.ProxyCartService.handle(collection.title)
          return this.app.services.CollectionService.create(collection, {transaction: options.transaction})
        })
    }
    else if (collection && isNumber(collection)) {
      return CollectionModel.findById(collection, options)
        .then(foundCollection => {
          if (!foundCollection) {
            throw new ModelError('E_NOT_FOUND', `Collection ${collection} not found`)
          }
          return foundCollection
        })
    }
    else if (collection && isString(collection)) {
      return CollectionModel.findOne(options = this.app.services.SequelizeService.mergeOptionDefaults(
        options,
        {
          where: {
            handle: this.app.services.ProxyCartService.handle(collection)
          }
        }
        )
      )
        .then(resCollection => {
          if (resCollection) {
            return resCollection
          }
          return this.app.services.CollectionService.create({
            handle: this.app.services.ProxyCartService.handle(collection),
            title: collection
          }, {
            transaction: options.transaction || null
          })
        })
    }
    else {
      // TODO make Proper Error
      const err = new Error(`Not able to resolve collection ${collection}`)
      return Promise.reject(err)
    }
  }
  /**
   *
   * @param collections
   * @param options
   * @returns {Promise.<T>}
   */
  transformCollections(collections = [], options: {[key: string]: any} = {}) {
    const CollectionModel = this
    const Sequelize = CollectionModel.sequelize

    // Transform if necessary to objects
    collections = collections.map(collection => {
      if (collection && isNumber(collection)) {
        return { id: collection }
      }
      else if (collection && isString(collection)) {
        return {
          handle: this.app.services.ProxyCartService.handle(collection),
          title: collection
        }
      }
      else if (collection && isObject(collection) && (collection.title || collection.handle)) {
        collection.handle = this.app.services.ProxyCartService.handle(collection.handle)
          || this.app.services.ProxyCartService.handle(collection.title)
        return collection
      }
    })
    // Filter out undefined
    collections = collections.filter(collection => collection)

    return Sequelize.Promise.mapSeries(collections, collection => {
      return CollectionModel.findOne({
        where: pick(collection, ['id', 'handle']),
        attributes: ['id', 'handle', 'title'],
        transaction: options.transaction || null
      })
      .then(foundCollectionModel => {
        if (foundCollectionModel) {
          return extend(foundCollectionModel, collection)
        }
        else {
          return this.app.services.CollectionService.create(collection, {
            transaction: options.transaction || null
          })
            .then(createdCollectionModel => {
              return extend(createdCollectionModel, collection)
            })
        }
      })
    })
  }
  /**
   *
   * @param collections
   */
  reverseTransformCollections (collections) {
    collections = collections || []
    collections.map(collection => {
      if (collection && isString(collection)) {
        return collection
      }
      else if (collection && collection.title) {
        return collection.title
      }
    })
    return collections
  }
}
/**
 * @module ProductCollection
 * @description Product Collection Model
 */
export class Collection extends Model {

  static get resolver() {
    return CollectionResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          COLLECTION_SORT_ORDER: COLLECTION_SORT_ORDER,
          COLLECTION_PURPOSE: COLLECTION_PURPOSE,
          COLLECTION_DISCOUNT_SCOPE: COLLECTION_DISCOUNT_SCOPE,
          COLLECTION_DISCOUNT_TYPE: COLLECTION_DISCOUNT_TYPE,
          COLLECTION_TAX_TYPE: COLLECTION_TAX_TYPE,
        },
        scopes: {
          live: {
            where: {
              live_mode: true
            }
          }
        },
        hooks: {
          beforeValidate: [
            (collection, options) => {
              if (!collection.handle && collection.title) {
                collection.handle = collection.title
              }
            }
          ],
          beforeCreate: [
            (collection, options) => {
              if (collection.body) {
                const bodyDoc = app.services.RenderGenericService.renderSync(collection.body)
                collection.body_html = bodyDoc.document
              }
              if (collection.excerpt) {
                const excerptDoc = app.services.RenderGenericService.renderSync(collection.excerpt)
                collection.excerpt_html = excerptDoc.document
              }
            }
          ],
          beforeUpdate: [
            (collection, options) => {
              if (collection.body) {
                const bodyDoc = app.services.RenderGenericService.renderSync(collection.body)
                collection.body_html = bodyDoc.document
              }
              if (collection.excerpt) {
                const excerptDoc = app.services.RenderGenericService.renderSync(collection.excerpt)
                collection.excerpt_html = excerptDoc.document
              }
            }
          ]
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // The handle of the Collection
      handle: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        set: function(val) {
          this.setDataValue('handle', app.services.ProxyCartService.splitHandle(val) || null)
        }
      },
      // The title of the Collection
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        set: function(val) {
          this.setDataValue('title', app.services.ProxyCartService.title(val))
        }
        // unique: true
      },
      // SEO title
      seo_title: {
        type: Sequelize.STRING,
        set: function(val) {
          this.setDataValue('seo_title', app.services.ProxyCartService.title(val))
        }
      },
      // SEO description
      seo_description: {
        type: Sequelize.TEXT,
        set: function(val) {
          this.setDataValue('seo_description', app.services.ProxyCartService.description(val))
        }
      },
      // The purpose of the collection
      primary_purpose: {
        type: Sequelize.ENUM,
        values: values(COLLECTION_PURPOSE),
        defaultValue: COLLECTION_PURPOSE.GROUP
      },

      // The id of the Shop
      shop_id: {
        type: Sequelize.INTEGER
      },
      // A description in text
      description: {
        type: Sequelize.TEXT
      },
      // An excerpt of the body of a collection (in markdown or html)
      excerpt: {
        type: Sequelize.TEXT
      },
      // The excerpt html of a collection (DO NOT EDIT DIRECTLY)
      excerpt_html: {
        type: Sequelize.TEXT
      },
      // The body of a collection (in markdown or html)
      body: {
        type: Sequelize.TEXT
      },
      // The html of a collection (DO NOT EDIT DIRECTLY)
      body_html: {
        type: Sequelize.TEXT
      },
      // If the Collection is published
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      // When the Collection was published
      published_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      // The scope Collection is published
      published_scope: {
        type: Sequelize.STRING,
        defaultValue: 'global'
      },
      // When the collection was unpublished
      unpublished_at: {
        type: Sequelize.DATE
      },
      // The position this collection is in reference to the other collections when displayed.
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The way Items are displayed in this collection
      sort_order: {
        type: Sequelize.ENUM,
        values: values(COLLECTION_SORT_ORDER),
        defaultValue: COLLECTION_SORT_ORDER.ALPHA_DESC
      },

      // TODO Tax Override for products in this collection
      // The type of a tax modifier
      tax_type: {
        type: Sequelize.ENUM,
        values: values(COLLECTION_TAX_TYPE),
        defaultValue: COLLECTION_TAX_TYPE.PERCENTAGE
      },
      // The rate of added tax if tax_type is a rate
      tax_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      // The percentage of added tax if tax_type is a percentage
      tax_percentage: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      // The name of the tax modifier
      tax_name: {
        type: Sequelize.STRING
      },

      // TODO Shipping Override for products in this collection
      // The type of the shipping modifier (rate, percentage)
      shipping_type: {
        type: Sequelize.ENUM,
        values: values(COLLECTION_SHIPPING_TYPE),
        defaultValue: COLLECTION_SHIPPING_TYPE.PERCENTAGE
      },
      // The shipping rate to be applied if shipping_type is rate
      shipping_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      // The shipping percentage to be applied if shipping_type is percentage
      shipping_percentage: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      // The name of the shipping modifier
      shipping_name: {
        type: Sequelize.STRING
      },
      // // The scope of the discount price modifier for the collection (individual, global)
      // discount_scope: {
      //   type: Sequelize.ENUM,
      //   values: values(COLLECTION_DISCOUNT_SCOPE),
      //   defaultValue: COLLECTION_DISCOUNT_SCOPE.INDIVIDUAL
      // },
      // // The type of the discount modifier (rate, percentage)
      // discount_type: {
      //   type: Sequelize.ENUM,
      //   values: values(COLLECTION_DISCOUNT_TYPE),
      //   defaultValue: COLLECTION_DISCOUNT_TYPE.PERCENTAGE
      // },
      // // The discount rate if the discount_type is rate
      // discount_rate: {
      //   type: Sequelize.FLOAT,
      //   defaultValue: 0.0
      // },
      // // A percentage to apply if the discount_type is percentage
      // discount_percentage: {
      //   type: Sequelize.FLOAT,
      //   defaultValue: 0.0
      // },
      // // TODO allow product includes
      // // List of product types allowed to discount
      // discount_product_include: helpers.JSONB('Collection', app, Sequelize, 'discount_product_include', {
      //   defaultValue: []
      // }),
      // // List of product_type [<string>] to forcefully excluded from discount modifiers
      // discount_product_exclude: helpers.JSONB('Collection', app, Sequelize, 'discount_product_exclude', {
      //   defaultValue: []
      // }),
      // List of product_type [<string>] to forcefully excluded from shipping modifiers
      shipping_product_exclude: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Collection', app, Sequelize, 'shipping_product_exclude', {
      //   defaultValue: []
      // }),
      // List of product_type [<string>] to forcefully excluded from tax modifiers
      tax_product_exclude: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('Collection', app, Sequelize, 'tax_product_exclude', {
      //   defaultValue: []
      // }),
      // Live Mode
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('engine.live_mode')
      }
    }
  }

  /**
   *
   * @param models
   */
  public static associate (models) {
    // Product Assoc
    models.Collection.belongsToMany(models.Product, {
      as: 'products',
      through: {
        model: models.ItemCollection,
        unique: false,
        scope: {
          model: 'product'
        },
        constraints: false
      },
      foreignKey: 'collection_id',
      otherKey: 'model_id',
      constraints: false
    })
    // Collection Assoc
    models.Collection.belongsToMany(models.Collection, {
      as: 'collections',
      through: {
        model: models.ItemCollection,
        unique: false,
        scope: {
          model: 'collection'
        },
        constraints: false
      },
      // foreignKey: 'model_id',
      // otherKey: 'collection_id',
      foreignKey: 'collection_id',
      otherKey: 'model_id',
      constraints: false
    })
    // Customer Assoc
    models.Collection.belongsToMany(models.Customer, {
      as: 'customers',
      through: {
        model: models.ItemCollection,
        unique: false,
        scope: {
          model: 'customer'
        },
        constraints: false
      },
      foreignKey: 'collection_id',
      otherKey: 'model_id',
      constraints: false
    })
    // Discount Assoc
    models.Collection.belongsToMany(models.Discount, {
      as: 'discounts',
      through: {
        model: models.ItemDiscount,
        unique: false,
        scope: {
          model: 'collection'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })
    // Images Assoc
    models.Collection.belongsToMany(models.Image, {
      as: 'images',
      through: {
        model: models.ItemImage,
        unique: false,
        scope: {
          model: 'collection'
        },
        constraints: false
      },
      foreignKey: 'model_id',
      constraints: false
    })
    // Metadata Assoc
    models.Collection.hasOne(models.Metadata, {
      as: 'metadata',
      foreignKey: 'collection_id'
    })
    models.Collection.belongsToMany(models.Tag, {
      as: 'tags',
      through: {
        model: models.ItemTag,
        unique: false,
        scope: {
          model: 'collection'
        }
      },
      foreignKey: 'model_id',
      otherKey: 'tag_id',
      constraints: false
    })
  }
}

export interface Collection {
  toJSON(): any
  resolveMetadata(options): any
  resolveDiscounts(options): any
}

/**
 * TODO, this should likely be done with a view
 * Format return data
 * Converts tags to array of strings
 * Returns only metadata data
 */
Collection.prototype.toJSON = function() {
  // Make JSON
  const resp = this instanceof this.app.models['Collection'].instance ? this.get({ plain: true }) : this
  // Set Defaults
  // resp.calculated_price = resp.price

  // Transform Tags to array on toJSON
  if (resp.tags) {
    // console.log(resp.tags)
    resp.tags = resp.tags.map(tag => {
      if (tag && isString(tag)) {
        return tag
      }
      else if (tag && tag.name && tag.name !== '') {
        return tag.name
      }
    })
  }
  // Transform Metadata to plain on toJSON
  if (resp.metadata) {
    if (typeof resp.metadata.data !== 'undefined') {
      resp.metadata = resp.metadata.data
    }
  }
  return resp
}

/**
*
*/
Collection.prototype.resolveMetadata = function(options: {[key: string]: any} = {}) {
  if (
    this.metadata
    && this.metadata instanceof this.app.models['Metadata'].instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getMetadata({transaction: options.transaction || null})
      .then(_metadata => {
        _metadata = _metadata || {collection_id: this.id}
        this.metadata = _metadata
        this.setDataValue('metadata', _metadata)
        this.set('metadata', _metadata)
        return this
      })
  }
}

Collection.prototype.resolveDiscounts = function(options: {[key: string]: any} = {}) {
  if (
    this.discounts
    && this.discount.every(d => d instanceof this.app.models['Discount'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getDiscounts({transaction: options.transaction || null})
      .then(_discounts => {
        _discounts = _discounts || []
        this.discounts = _discounts
        this.setDataValue('discounts', _discounts)
        this.set('discounts', _discounts)
        return this
      })
  }
}
