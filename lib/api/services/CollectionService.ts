import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'

import * as _ from 'lodash'
import * as fs from 'fs'
// const COLLECTION_DISCOUNT_TYPE = require('../../lib').Enums.COLLECTION_DISCOUNT_TYPE
// const COLLECTION_DISCOUNT_SCOPE = require('../../lib').Enums.COLLECTION_DISCOUNT_SCOPE

/**
 * @module CollectionService
 * @description Collection Service
 */
export class CollectionService extends Service {
  publish(type, event, options: {save?: boolean, transaction?: any, include?: any} = {}) {
    if (this.app.services.EventsService) {
      options.include = options.include ||  [{
        model: this.app.models.EventItem.instance,
        as: 'objects'
      }]
      return this.app.services.EventsService.publish(type, event, options)
    }
    this.app.log.debug('spool-events is not installed, please install it to use publish')
    return Promise.resolve()
  }
  /**
   * Add a Collection
   * @param collection
   * @param options
   * @returns {Promise.<T>}
   */
  add(collection, options: {[key: string]: any} = {}) {
    const Collection = this.app.models.Collection

    return Collection.resolve(collection, {
      transaction: options.transaction || null,
      reject: false
    })
      .then(resCollection => {
        if (!resCollection) {
          // Create a new Collection
          return this.create(collection, {transaction: options.transaction || null})
        }
        else {
          // Update the existing collection
          resCollection = _.merge(resCollection, collection)
          return this.update(resCollection, {transaction: options.transaction || null})
        }
      })
  }

  /**
   *
   * @param collection
   * @param options
   */
  create(collection, options) {
    options = options || {}
    const Collection =  this.app.models['Collection']
    const Image =  this.app.models['Image']
    const Discount = this.app.models['Discount']
    const Tag = this.app.models['Tag']
    let discounts = []

    let resCollection

    let create = _.omit(collection, [
      'collections',
      'images',
      'discounts',
      'discount_name',
      'discount_status',
      'discount_code',
      'discount_scope',
      'discount_type',
      'discount_product_exclude',
      'discount_product_include',
      'discount_rate',
      'discount_percentage',
      'tags'
    ])

    create = _.omitBy(create, _.isNil)

    if (collection.discount_type && collection.discount_type) {
      discounts.push({
        name: collection.discount_name || collection.title,
        code: collection.discount_code || collection.title,
        status: collection.discount_status,
        discount_scope: collection.discount_scope,
        discount_type: collection.discount_type,
        discount_product_exclude: collection.discount_product_exclude,
        discount_product_include: collection.discount_product_include,
        discount_rate: collection.discount_rate,
        discount_percentage: collection.discount_percentage
      })
    }
    if (collection.discounts && collection.discounts.length > 0) {
      discounts = [...discounts, ...collection.discounts]
    }

    return Collection.create(create, {transaction: options.transaction || null})
      .then(createdCollection => {
        if (!createdCollection) {
          throw new Error('Collection was not created')
        }
        resCollection = createdCollection

        if (collection.collections && collection.collections.length > 0) {
          // Resolve the collections
          collection.collections = _.sortedUniq(collection.collections.filter(n => n))
          return Collection.transformCollections(collection.collections, {transaction: options.transaction || null})
        }
        return []
      })
      .then(collections => {
        if (collections && collections.length > 0) {
          return resCollection.setCollections(collections.map( c => c.id), {transaction: options.transaction || null})
        }
        return
      })
      .then(collections => {
        if (collection.images && collection.images.length > 0) {
          // Resolve the images
          collection.images = _.sortedUniq(collection.images.filter(n => n))
          return Image.transformImages(collection.images, {transaction: options.transaction || null})
        }
        return []
      })
      .then(images => {
        if (images && images.length > 0) {
          return Collection.sequelize.Promise.mapSeries(images, (image, index) => {
            return resCollection.addImage(image.id, {through: {position: index + 1 }, transaction: options.transaction || null})
          })
        }
        return
      })
      .then(() => {
        if (discounts.length > 0) {
          return Discount.transformDiscounts(discounts, {transaction: options.transaction || null})
        }
        return
      })
      .then(_discounts => {
        if (_discounts && _discounts.length > 0) {
          return resCollection.setDiscounts(_discounts.map(d => d.id), {transaction: options.transaction || null})
        }
        return
      })
      .then(_discounts => {
        if (collection.tags && collection.tags.length > 0) {
          collection.tags = _.sortedUniq(collection.tags.filter(n => n))
          return Tag.transformTags(collection.tags, {transaction: options.transaction || null})
        }
        return
      })
      .then(tags => {
        if (tags && tags.length > 0) {
          // Add Tags
          return resCollection.setTags(tags.map(tag => tag.id), {transaction: options.transaction || null})
        }
        return
      })
      .then(tags => {
        return Collection.findByIdDefault(resCollection.id, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param collection
   * @param options
   */
  update(collection, options) {
    options = options || {}
    const Collection =  this.app.models['Collection']
    const Image =  this.app.models['Image']
    const Tag =  this.app.models['Tag']

    if (!collection.id) {
      const err = new ModelError('E_NOT_FOUND', 'Collection is missing id')
      return Promise.reject(err)
    }

    const update = _.omit(collection, ['id', 'created_at', 'updated_at', 'collections', 'images', 'tags'])

    let resCollection
    return Collection.resolve(collection, {
      transaction: options.transaction || null,
      reject: true
    })
      .then(_collection => {
        if (!_collection) {
          throw new Error('Collection could not be resolved')
        }
        resCollection = _collection
        return resCollection.update(update, {transaction: options.transaction || null})
      })
      .then(updatedCollection => {
        resCollection = updatedCollection
        if (collection.collections && collection.collections.length > 0) {
          // Resolve the collections
          collection.collections = _.sortedUniq(collection.collections.filter(n => n))
          return Collection.transformCollections(collection.collections, {transaction: options.transaction || null})
        }
        return
      })
      .then(collections => {
        if (collections && collections.length > 0) {
          return resCollection.setCollections(collections.map(c => c.id), {transaction: options.transaction || null})
        }
        return []
      })
      .then(collections => {
        if (collection.images && collection.images.length > 0) {
          // Resolve the images
          collection.images = _.sortedUniq(collection.images.filter(n => n))
          return Image.transformImages(collection.images, {transaction: options.transaction || null})
        }
        else {
          return []
        }
      })
      .then(images => {
        if (images && images.length > 0) {
          return Collection.sequelize.Promise.mapSeries(images, (image, index) => {
            return resCollection.addImage(image.id, {
              through: {position: index + 1},
              transaction: options.transaction || null
            })
          })
        }
        return
      })
      .then(images => {
        if (collection.tags && collection.tags.length > 0) {
          collection.tags = _.sortedUniq(collection.tags.filter(n => n))
          return Tag.transformTags(collection.tags, {transaction: options.transaction || null})
        }
        return
      })
      .then(tags => {
        if (tags && tags.length > 0) {
          // Add Tags
          return resCollection.setTags(tags.map(tag => tag.id), {transaction: options.transaction || null})
        }
        return
      })
      .then(() => {
        return Collection.findByIdDefault(resCollection.id, {transaction: options.transaction || null})
      })
  }

  /**
   * Add Multiple Collections
   * @param collection
   * @param collections
   * @param options
   * @returns {Promise.<*>}
   */
  addCollections(collection, collections, options) {
    options = options || {}
    if (!Array.isArray(collections)) {
      collections = [collections]
    }
    const Sequelize = this.app.models['Collection'].sequelize
    // const addedProducts = []
    // Setup Transaction
    return Sequelize.transaction(t => {
      return Sequelize.Promise.mapSeries(collections, subCollection => {
        return this.addCollection(collection, subCollection, {
          transaction: t
        })
      })
    })
  }

  /**
   *
   * @param collection
   * @param subCollection
   * @param options
   * @returns {Promise.<T>}
   */
  addCollection(collection, subCollection, options) {
    options = options || {}
    const Collection = this.app.models['Collection']
    // const ItemCollection = this.app.models['ItemCollection']
    let resCollection, resSubCollection
    return Collection.resolveOrCreate(collection, {
      transaction: options.transaction || null
    })
      .then(([_collection, _created]) => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', 'Collection not found')
        }
        resCollection = _collection
        return Collection.resolve(subCollection, {
          transaction: options.transaction || null,
          reject: true
        })
      })
      .then(_subCollection => {
        if (!_subCollection) {
          throw new ModelError('E_NOT_FOUND', 'Sub Collection not found')
        }
        resSubCollection = _subCollection
      //   return resCollection.hasCollection(resSubCollection.id, {transaction: options.transaction || null})
      // })
      // .then(hasCollection => {
        // if (!hasCollection) {
          // return ItemCollection.create({
          //   collection_id: resCollection.id,
          //   model_id: resSubCollection.id,
          //   model: 'collection'
          // }, {transaction: options.transaction || null})
        const through = subCollection.collection_position ? { position: subCollection.collection_position } : {}
        return resCollection.addCollection(resSubCollection.id, {
          through: through,
          hooks: false,
          individualHooks: false,
          returning: false,
          transaction: options.transaction || null
        })
        // }
        // return
      })
      .then(() => {
        return resSubCollection
        // return Collection.findByIdDefault(resCollection.id, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param collection
   * @param subCollection
   * @param options
   * @returns {Promise.<T>}
   */
  removeCollection(collection, subCollection, options) {
    options = options || {}
    const Collection = this.app.models['Collection']
    let resCollection, resSubCollection
    return Collection.resolve(collection, {
      transaction: options.transaction || null,
      reject: true
    })
      .then(_collection => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', 'Collection not found')
        }
        resCollection = _collection
        return Collection.resolve(subCollection, {
          transaction: options.transaction || null,
          reject: true
        })
      })
      .then(_subCollection => {
        if (!_subCollection) {
          throw new ModelError('E_NOT_FOUND', 'Sub Collection not found')
        }
        resSubCollection = _subCollection
        return resCollection.hasCollection(resSubCollection.id, {transaction: options.transaction || null})
      })
      .then(hasCollection => {
        if (hasCollection) {
          return resCollection.removeCollection(resSubCollection.id, {transaction: options.transaction || null})
        }
        return resCollection
      })
      .then(_collection => {
        return resSubCollection
        // return Collection.findByIdDefault(resCollection.id, {transaction: options.transaction || null})
      })
  }

  /**
   * Add Multiple Products
   * @param collection
   * @param products
   * @param options
   * @returns {Promise.<*>}
   */
  addProducts(collection, products, options) {
    options = options || {}
    if (!Array.isArray(products)) {
      products = [products]
    }
    const Sequelize = this.app.models['Collection'].sequelize
    // const addedProducts = []
    // Setup Transaction
    return Sequelize.transaction(t => {
      return Sequelize.Promise.mapSeries(products, product => {
        return this.addProduct(collection, product, {
          transaction: t
        })
      })
    })
  }
  /**
   *
   * @param collection
   * @param product
   * @param options
   * @returns {Promise.<T>}
   */
  addProduct(collection, product, options) {
    options = options || {}
    const Collection = this.app.models['Collection']
    const Product = this.app.models['Product']
    let resCollection, resProduct
    return Collection.resolve(collection, {
      transaction: options.transaction || null,
      reject: true
    })
      .then(_collection => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', 'Collection not found')
        }
        resCollection = _collection
        return Product.resolve(product, {transaction: options.transaction || null})
      })
      .then(_product => {
        if (!_product) {
          throw new ModelError('E_NOT_FOUND', 'Product not found')
        }
        resProduct = _product
        return resCollection.hasProduct(resProduct.id, {transaction: options.transaction || null})
      })
      .then(hasCollection => {
        const through = product.product_position ? {position: product.product_position} : {}
        // if (!hasCollection) {
        return resCollection.addProduct(resProduct.id, {
          through: through,
          transaction: options.transaction || null
        })
        // }
        // else if (product.product_position) {
        //   return resCollection.updateProduct(resProduct.id, {
        //     through: through,
        //     transaction: options.transaction || null
        //   })
        // }
        // return resCollection
      })
      .then(_collection => {
        return resProduct
      })
  }

  /**
   *
   * @param collection
   * @param product
   * @param options
   * @returns {Promise.<T>}
   */
  removeProduct(collection, product, options) {
    options = options || {}
    const Collection = this.app.models['Collection']
    const Product = this.app.models['Product']
    let resCollection, resProduct
    return Collection.resolve(collection, {
      transaction: options.transaction || null,
      reject: true
    })
      .then(_collection => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', 'Collection not found')
        }
        resCollection = _collection
        return Product.resolve(product, {transaction: options.transaction || null})
      })
      .then(_product => {
        if (!_product) {
          throw new ModelError('E_NOT_FOUND', 'Product not found')
        }
        resProduct = _product
        return resCollection.hasProduct(resProduct.id, {transaction: options.transaction || null})
      })
      .then(hasCollection => {
        if (hasCollection) {
          return resCollection.removeProduct(resProduct.id, {transaction: options.transaction || null})
        }
        return resCollection
      })
      .then(_collection => {
        return resProduct
        // return Collection.findByIdDefault(resCollection.id, {transaction: options.transaction || null})
      })
  }



  /**
   * @param collection
   * @param images
   */
  removeImages(collection, images) {
    if (!Array.isArray(images)) {
      images = [images]
    }
    const Collection = this.app.models['Collection']
    return Collection.sequelize.Promise.mapSeries(images, image => {
      const collectionId = typeof collection.id !== 'undefined' ? collection.id : collection
      const id = typeof image.id !== 'undefined' ? image.id : image
      return this.removeImage(collectionId, id)
    })
  }

  /**
   * @param collectionId
   * @param id
   * @param options
   */
  removeImage(collectionId, id, options: { [key: string]: any } = {}) {
    const Image = this.app.models['ItemImage']
    const Collection = this.app.models['Collection']

    let resDestroy
    return Image.findOne({ where: { image_id: id }}, {
      transaction: options.transaction || null
    })
      .then(_image => {
        if (!_image) {
          // TODO proper error
          throw new Error(`Image ${id} not found`)
        }
        resDestroy = _image

        return Image.findAll({
          where: {
            model_id: resDestroy.model_id,
            model: 'collection'
          },
          order: [['position', 'ASC']],
          transaction: options.transaction || null
        })
      })
      .then(foundImages => {
        foundImages = foundImages.filter(image => image.id !== id)
        foundImages = foundImages.map((image, index) => {
          image.position = index + 1
          return image
        })
        return Image.sequelize.Promise.mapSeries(foundImages, image => {
          return image.save({
            transaction: options.transaction || null
          })
        })
      })
      .then(updatedImages => {
        return resDestroy.destroy({
          transaction: options.transaction || null
        })
      })
      // .then(() => {
      //   return Collection.findByIdDefault(resDestroy.collection_id, { transaction: options.transaction || null })
      // })
  }

  /**
   * @param collection
   * @param images
   */
  addImages(collection, images) {
    if (!Array.isArray(images)) {
      images = [images]
    }
    const Collection = this.app.models['Collection']
    return Collection.sequelize.Promise.mapSeries(images, image => {
      const id = typeof image.id !== 'undefined' ? image.id : image
      return this.addImage(collection, id)
    })
  }

  /**
   * @param collection
   * @param variant
   * @param image
   * @param options
   */
  // TODO
  addImage(collection, image, options: { [key: string]: any } = {}) {
    const Image = this.app.models['ItemImage']
    const Collection = this.app.models['Collection']

    let resCollection, resImage
    return Collection.resolve(collection, { transaction: options.transaction || null })
      .then(foundCollection => {
        if (!foundCollection) {
          throw new Error('Collection could not be resolved')
        }
        resCollection = foundCollection

        return resCollection.createImage({
          src: image,
          position: options.position || null,
          alt: options.alt || null
        }, {
          transaction: options.transaction
        })
      })
      .then(createdImage => {
        if (!createdImage) {
          throw new Error('Image Could not be created')
        }
        resImage = createdImage
        return Image.findAll({
          where: {
            model_id: resCollection.id,
            model: 'collection'
          },
          order: [['position', 'ASC']],
          transaction: options.transaction || null
        })
      })
      .then(foundImages => {
        foundImages = foundImages.map((_image, index) => {
          _image.position = index + 1
          return _image
        })
        return Image.sequelize.Promise.mapSeries(foundImages, _image => {
          return _image.save({
            transaction: options.transaction || null
          })
        })
      })
      .then(updatedImages => {
        return resImage.reload()
      })
  }

  createImage(collection, filePath, options: { [key: string]: any } = {}) {
    const image = fs.readFileSync(filePath)
    const Image = this.app.models['ItemImage']
    const Collection = this.app.models['Collection']
    let resCollection, resImage
    return Collection.resolve(collection, { transaction: options.transaction || null })
      .then(_collection => {
        if (!_collection) {
          throw new Error('Collection could not be resolved')
        }
        resCollection = _collection
        return this.app.services.ProxyCartService.uploadImage(image, filePath)
      })
      .then(uploadedImage => {
        return resCollection.createImage({
          src: uploadedImage.url,
          position: options.position || null,
          alt: options.alt || null
        }, {
          transaction: options.transaction
        })
      })
      .then(createdImage => {
        if (!createdImage) {
          throw new Error('Image Could not be created')
        }
        resImage = createdImage
        return Image.findAll({
          where: {
            model_id: resCollection.id,
            model: 'collection'
          },
          order: [['position', 'ASC']],
          transaction: options.transaction || null
        })
      })
      .then(foundImages => {
        foundImages = foundImages.map((_image, index) => {
          _image.position = index + 1
          return _image
        })
        return Image.sequelize.Promise.mapSeries(foundImages, _image => {
          return _image.save({
            transaction: options.transaction || null
          })
        })
      })
      .then(updatedImages => {
        return resImage.reload()
      })
  }

  /**
   *
   * @param collection
   * @param tag
   * @param options
   * @returns {Promise.<T>}
   */
  addTag(collection, tag, options) {
    options = options || {}
    const Collection = this.app.models['Collection']
    const Tag = this.app.models['Tag']
    let resCollection, resTag
    return Collection.resolve(collection, {
      transaction: options.transaction || null,
      reject: true
    })
      .then(_collection => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', 'Collection not found')
        }
        resCollection = _collection
        return Tag.resolve(tag, {transaction: options.transaction || null})
      })
      .then(_tag => {
        if (!_tag) {
          throw new ModelError('E_NOT_FOUND', 'Tag not found')
        }
        resTag = _tag
        return resCollection.hasTag(resTag.id, {transaction: options.transaction || null})
      })
      .then(hasCollection => {
        if (!hasCollection) {
          return resCollection.addTag(resTag.id, {transaction: options.transaction || null})
        }
        return resCollection
      })
      .then(_collection => {
        return Collection.findByIdDefault(resCollection.id, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param collection
   * @param tag
   * @param options
   * @returns {Promise.<T>}
   */
  removeTag(collection, tag, options) {
    options = options || {}
    const Collection = this.app.models['Collection']
    const Tag = this.app.models['Tag']
    let resCollection, resTag
    return Collection.resolve(collection, {
      transaction: options.transaction || null,
      reject: true
    })
      .then(_collection => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', 'Collection not found')
        }
        resCollection = _collection
        return Tag.resolve(tag, {transaction: options.transaction || null})
      })
      .then(_tag => {
        if (!_tag) {
          throw new ModelError('E_NOT_FOUND', 'Tag not found')
        }
        resTag = _tag
        return resCollection.hasTag(resTag.id, {transaction: options.transaction || null})
      })
      .then(hasCollection => {
        if (hasCollection) {
          return resCollection.removeTag(resTag.id, {transaction: options.transaction || null})
        }
        return resCollection
      })
      .then(_collection => {
        return Collection.findByIdDefault(resCollection.id, {transaction: options.transaction || null})
      })
  }

  /**
   * Add Multiple Customers
   * @param collection
   * @param customers
   * @param options
   * @returns {Promise.<*>}
   */
  addCustomers(collection, customers, options) {
    options = options || {}
    if (!Array.isArray(customers)) {
      customers = [customers]
    }
    const Sequelize = this.app.models['Collection'].sequelize
    // const addedProducts = []
    // Setup Transaction
    return Sequelize.transaction(t => {
      return Sequelize.Promise.mapSeries(customers, customer => {
        return this.addCustomer(collection, customer, {
          transaction: t
        })
      })
    })
  }

  /**
   *
   * @param collection
   * @param customer
   * @param options
   * @returns {Promise.<T>}
   */
  addCustomer(collection, customer, options) {
    options = options || {}
    const Collection = this.app.models['Collection']
    const Customer = this.app.models['Customer']
    let resCollection, resCustomer
    return Collection.resolve(collection, {
      transaction: options.transaction || null,
      reject: true
    })
      .then(_collection => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', 'Collection not found')
        }
        resCollection = _collection
        return Customer.resolve(customer, {transaction: options.transaction || null, create: false})
      })
      .then(_customer => {
        if (!_customer) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCustomer = _customer
        return resCollection.hasCustomer(resCustomer.id, {transaction: options.transaction || null})
      })
      .then(hasCollection => {
        if (!hasCollection) {
          return resCollection.addCustomer(resCustomer.id, {transaction: options.transaction || null})
        }
        return resCollection
      })
      .then(_collection => {
        return resCustomer
        // return Collection.findByIdDefault(resCollection.id, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param collection
   * @param customer
   * @param options
   * @returns {Promise.<TResult>}
   */
  removeCustomer(collection, customer, options: {[key: string]: any} = {}) {
    const Collection = this.app.models['Collection']
    const Customer = this.app.models['Customer']
    let resCollection, resCustomer
    return Collection.resolve(collection, {
      transaction: options.transaction || null,
      reject: true
    })
      .then(_collection => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', 'Collection not found')
        }
        resCollection = _collection
        return Customer.resolve(customer, {create: false})
      })
      .then(_customer => {
        if (!_customer) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCustomer = _customer
        return resCollection.hasCustomer(resCustomer.id)
      })
      .then(hasCollection => {
        if (hasCollection) {
          return resCollection.removeCustomer(resCustomer.id)
        }
        return resCollection
      })
      .then(_collection => {
        return resCustomer
        // return Collection.findByIdDefault(resCollection.id)
      })
  }

  /**
   * Sales Analytics for a given Collection
   * @param collection
   * @param options
   * @returns {Promise.<TResult>}
   */
  analytics(collection, options: {[key: string]: any} = {}) {
    const Collection = this.app.models['Collection']
    const OrderItem = this.app.models['OrderItem']
    let resCollection
    return Collection.resolve(collection, {
      transaction: options.transaction || null,
      reject: true
    })
      .then(_collection => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', 'Collection not found')
        }
        resCollection = _collection
        return resCollection.resolveProducts({ attributes: ['id']})
      })
      .then((_collection) => {
        const ids = resCollection.products.map(p => p.id)
        console.log(ids)

        return OrderItem.findAll({
          where: {
            product_id: ids
          },
          attributes: [
            [OrderItem.sequelize.literal('SUM(calculated_price)'), 'total'],
            [OrderItem.sequelize.literal('SUM(price)'), 'value'],
            [OrderItem.sequelize.literal('COUNT(id)'), 'count'],
            // 'currency'
          ],
          // group: ['currency']
        })
          .then(count => {
            let data = count.map(c => {
              const cTotal = c instanceof OrderItem.instance
                ? c.get('total') || 0
                : c.total || 0
              const cValue = c instanceof OrderItem.instance
                ? c.get('value') || 0
                : c.value || 0
              const cCount = c instanceof OrderItem.instance
                ? c.get('count') || 0
                : c.count || 0

              return {
                count: parseInt(cCount, 10),
                total: parseInt(cTotal, 10),
                value: parseInt(cValue, 10)
              }
            })

            if (data.length === 0) {
              data = [{
                count: 0,
                total: 0,
                value: 0
              }]
            }

            return data
          })
      })
  }
}

