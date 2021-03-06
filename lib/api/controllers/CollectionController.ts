import { FabrixController as Controller } from '@fabrix/fabrix/dist/common'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import * as Validator from '../../validator'
import { defaultsDeep, isString, isNumber, orderBy, extend } from 'lodash'
/**
 * @module CollectionController
 * @description Generated Fabrix Controller.
 */
export class CollectionController extends Controller {
  generalStats(req, res) {
    res.json({})
  }
  /**
   *
   * @param req
   * @param res
   */
  count(req, res) {
    const EventsService = this.app.services.EventsService
    EventsService.count('Collection')
      .then(count => {
        const counts = {
          collections: count
        }
        return res.json(counts)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   *
   * @param req
   * @param res
   */
  findById(req, res) {
    const Collection = this.app.models['Collection']
    const collectionId = req.params.id
    Promise.resolve()
      .then(() => {
        if (isNumber(collectionId)) {
          return Collection.findByIdDefault(collectionId, {})
        }
        else if (isString(collectionId)) {
          return Collection.findByHandleDefault(collectionId, {})
        }
        else {
          throw new Error('Unhandled Identifier')
        }
      })
      .then((_collection) => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', `Collection ${ collectionId} not found`)
        }
        return this.app.services.PermissionsService.sanitizeResult(req, _collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  findByHandle(req, res) {
    const Collection = this.app.models['Collection']
    Collection.findByHandleDefault(req.params.handle)
      .then(_collection => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', `Collection handle ${ req.params.handle } not found`)
        }
        return this.app.services.PermissionsService.sanitizeResult(req, _collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  findOne(req, res) {
    const orm = this.app.models
    const Collection = orm['Collection']
    const where = req.jsonCriteria(req.query.where)

    Collection.findOneDefault({
      where: where
    })
      .then(collection => {
        if (!collection) {
          throw new ModelError('E_NOT_FOUND', `Collection id ${ req.params.id } not found`)
        }
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  findAll(req, res) {
    const orm = this.app.models
    const Collection = orm['Collection']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    const where = req.jsonCriteria(req.query.where)

    Collection.findAndCountDefault({
      where: where,
      order: sort,
      offset: offset,
      limit: limit
    })
      .then(collections => {
        // Paginate
        res.paginate(collections.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, collections.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  search(req, res) {
    const orm = this.app.models
    const Collection = orm['Collection']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    const term = req.query.term
    const where = req.jsonCriteria(req.query.where)
    const defaults = defaultsDeep(where, {
      $or: [
        {
          title: {
            $iLike: `%${term}%`
          }
        }
      ]
    })

    Collection.findAndCountDefault({
      where: defaults,
      order: sort,
      offset: offset,
      limit: limit
    })
      .then(collections => {
        // Paginate
        res.paginate(collections.count, limit, offset, sort)

        return this.app.services.PermissionsService.sanitizeResult(req, collections.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  create(req, res) {
    const CollectionService = this.app.services.CollectionService
    Validator.validateCollection.create(req.body)
      .then(values => {
        return CollectionService.create(req.body)
      })
      .then(collection => {
        if (!collection) {
          throw new ModelError('E_NOT_FOUND', 'Collection Could was not Created')
        }
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })

  }

  /**
   *
   * @param req
   * @param res
   */
  update(req, res) {
    const CollectionService = this.app.services.CollectionService
    Validator.validateCollection.update(req.body)
      .then(values => {
        req.body.id = req.params.id
        return CollectionService.update(req.body)
      })
      .then(collection => {
        if (!collection) {
          throw new ModelError('E_NOT_FOUND', 'Collection was not updated')
        }
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  addCollections(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.addCollections(req.params.id, req.body)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   *
   * @param req
   * @param res
   */
  addCollection(req, res) {
    const CollectionService = this.app.services.CollectionService

    const collection = req.body || {}
    if (isString(req.params.collection)) {
      collection.handle = req.params.collection
    }
    else {
      collection.id = req.params.collection
    }

    CollectionService.addCollection(req.params.id, collection)
      .then(_collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, _collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  removeCollection(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.removeCollection(req.params.id, req.params.collection)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  removeCollections(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.removeCollections(req.params.id, req.body)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  collections(req, res) {
    const Collection = this.app.models['Collection']
    const collectionId = req.params.id
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    const where = req.jsonCriteria(req.query.where)

    if (!collectionId) {
      const err = new Error('A collection id is required')
      return res.send(401, err)
    }

    const ItemCollection = this.app.models['ItemCollection']

    let count = 0

    Collection.resolve(collectionId, {
      attributes: ['id']
    })
      .then(_collection => {

        return ItemCollection.findAndCountAll({
          where: {
            collection_id: _collection.id,
            model: 'collection'
          },
          attributes: ['model_id'],
          limit: limit,
          offset: offset
        })
      })
      .then(arr => {
        count = arr.count
        const collectionIds = arr.rows.map(model => model.model_id)
        return Collection.findAllDefault({
          where: {
            id: collectionIds
          }
        })
      })
      .then(collections => {
        // Paginate
        res.paginate(count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, collections)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })

    // Collection.findAndCountAll({
    //   order: sort,
    //   // where: {
    //   //   '$collections.id$': collectionId
    //   // },
    //   include: [
    //     {
    //       model: this.app.models['Collection'],
    //       as: 'collections',
    //       where: {
    //         id: collectionId
    //       }
    //     }
    //   ],
    //   offset: offset,
    //   limit: limit
    // })
    //   .then(collections => {
    //     // Paginate
    //     res.paginate(collections.count, limit, offset, sort)
    //     return this.app.services.PermissionsService.sanitizeResult(req, collections.rows)
    //   })
    //   .then(result => {
    //     return res.json(result)
    //   })
    //   .catch(err => {
    //     return res.serverError(err)
    //   })
  }

  /**
   *
   * @param req
   * @param res
   */
  addProducts(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.addProducts(req.params.id, req.body)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  addProduct(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.addProduct(req.params.id, req.params.product)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  removeProduct(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.removeProduct(req.params.id, req.params.product)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  products(req, res) {
    const Product = this.app.models['Product']
    const Collection = this.app.models['Collection']
    const ItemCollection = this.app.models['ItemCollection']
    let collectionId = req.params.id
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['position', 'ASC']]
    const where = req.jsonCriteria(req.query.where)

    if (!collectionId) {
      const err = new Error('A collection id is required')
      return res.send(401, err)
    }

    let count = 0, models = [], resProducts = []

    Collection.resolve(collectionId, {
      attributes: ['id']
    })
    .then(_collection => {
      collectionId = _collection.id
      return Product.findAllDefault({
        where: where,
        include: [{
          model: Collection.instance,
          as: 'collections',
          attributes: ['id'],
          where: {
            id: collectionId
          }
        }],
        req: req
      })
    })
    .then((products = []) => {
      resProducts = products
      const ids = resProducts.map(p => p.id)

      return ItemCollection.findAndCountAll({
        where: {
          collection_id: collectionId,
          model: 'product',
          model_id: ids
        },
        attributes: ['model_id', 'position'],
        order: sort,
        limit: limit,
        offset: offset
      })
    })
    .then((arr = { count: 0, rows: []}) => {
      count = arr.count
      models = orderBy(arr.rows, ['position'], ['asc'])

      // Assign the positions from Item Collections to Product
      resProducts = resProducts.map(product => {
        return extend(product, {position: models.find(m => m.model_id === product.id).position})
      })

      // Order the products
      resProducts = orderBy(resProducts, ['position'], ['asc'])

      // Paginate
      res.paginate(count, limit, offset, sort)
      return this.app.services.PermissionsService.sanitizeResult(req, resProducts)
    })
    .then(result => {
      return res.json(result)
    })
    .catch(err => {
      return res.serverError(err)
    })

    // Product.findAndCountAll({
    //   include: [
    //     {
    //       model: this.app.models['Collection'],
    //       as: 'collections',
    //       required: true,
    //       where: {
    //         id: collectionId
    //       }
    //     }
    //   ],
    //   order: sort,
    //   offset: offset,
    //   limit: limit
    // })
    //   .then(products => {
    //     // Paginate
    //     res.paginate(products.count, limit, offset, sort)
    //     return this.app.services.PermissionsService.sanitizeResult(req, products.rows)
    //   })
    //   .then(result => {
    //     return res.json(result)
    //   })
    //   .catch(err => {
    //     return res.serverError(err)
    //   })
  }

  /**
   *
   * @param req
   * @param res
   */
  addTag(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.addTag(req.params.id, req.params.tag)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  removeTag(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.removeTag(req.params.id, req.params.tag)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  tags(req, res) {
    const Tag = this.app.models['Tag']
    const collectionId = req.params.id
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    if (!collectionId) {
      const err = new Error('A collection id is required')
      return res.send(401, err)
    }

    Tag.findAndCountAll({
      order: sort,
      include: [
        {
          model: this.app.models['Collection'].instance,
          as: 'collections',
          where: {
            id: collectionId
          }
        }
      ],
      offset: offset,
      limit: limit
    })
      .then(tags => {
        // Paginate
        res.paginate(tags.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, tags.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  addCustomers(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.addCustomers(req.params.id, req.body)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   *
   * @param req
   * @param res
   */
  addCustomer(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.addCustomer(req.params.id, req.params.customer)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  removeCustomer(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.removeCustomer(req.params.id, req.params.customer)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  customers(req, res) {
    const Customer = this.app.models['Customer']
    const collectionId = req.params.id
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    if (!collectionId) {
      const err = new Error('A collection id is required')
      return res.send(401, err)
    }

    Customer.findAndCountAll({
      include: [
        {
          model: this.app.models['Collection'].instance,
          as: 'collections',
          where: {
            id: collectionId
          }
        }
      ],
      order: sort,
      offset: offset,
      limit: limit
    })
      .then(customers => {
        // Paginate
        res.paginate(customers.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, customers.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  discounts(req, res) {
    const Discount = this.app.models['Discount']
    const collectionId = req.params.id
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    if (!collectionId) {
      const err = new Error('A collection id is required')
      return res.send(401, err)
    }

    Discount.findAndCountAll({
      include: [
        {
          model: this.app.models['Collection'].instance,
          as: 'collections',
          where: {
            id: collectionId
          }
        }
      ],
      order: sort,
      offset: offset,
      limit: limit
    })
      .then(discounts => {
        // Paginate
        res.paginate(discounts.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, discounts.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }


  /**
   *
   * @param req
   * @param res
   */
  addImages(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.addImages(req.params.id, req.body)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   *
   * @param req
   * @param res
   */
  addImage(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.addImage(req.params.id, req.params.image)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  createImage(req, res) {
    const CollectionService = this.app.services.CollectionService
    const image = req.file
    const collection = req.params.id

    if (!image) {
      const err = new Error('Image File failed to upload, check input type is file and try again.')
      return res.serverError(err)
    }

    CollectionService.createImage(collection, image.path, req.body)
      .then(_image => {
        return this.app.services.PermissionsService.sanitizeResult(req, _image)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  removeImages(req, res) {
    const CollectionService = this.app.services.CollectionService

    CollectionService.removeImages(req.params.id, req.body)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   *
   * @param req
   * @param res
   */
  removeImage(req, res) {
    const CollectionService = this.app.services.CollectionService
    CollectionService.removeImage(req.params.id, req.params.image)
      .then(collection => {
        return this.app.services.PermissionsService.sanitizeResult(req, collection)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  images(req, res) {
    const Image = this.app.models['Image']
    const collectionId = req.params.id
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    if (!collectionId) {
      const err = new Error('A collection id is required')
      return res.send(401, err)
    }

    Image.findAndCountAll({
      include: [
        {
          model: this.app.models['Collection'].instance,
          as: 'collections',
          where: {
            id: collectionId
          }
        }
      ],
      order: sort,
      offset: offset,
      limit: limit
    })
      .then(images => {
        // Paginate
        res.paginate(images.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, images.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   * upload CSV
   * @param req
   * @param res
   */
  uploadCSV(req, res) {
    const CollectionCsvService = this.app.services.CollectionCsvService
    const csv = req.file

    if (!csv) {
      const err = new Error('File failed to upload')
      return res.serverError(err)
    }

    CollectionCsvService.collectionCsv(csv.path)
      .then(result => {
        return res.json({
          file: req.file,
          result: result
        })
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  processUpload(req, res) {
    const CollectionCsvService = this.app.services.CollectionCsvService
    CollectionCsvService.processCollectionUpload(req.params.id)
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  analytics(req, res) {
    const collectionId = req.params.id

    if (!collectionId) {
      const err = new Error('A collection id is required')
      return res.send(401, err)
    }

    this.app.services.CollectionService.analytics(collectionId, {})
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })

  }
}

