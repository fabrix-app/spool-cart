

import { FabrixController as Controller } from '@fabrix/fabrix/dist/common'
const _ = require('lodash')

/**
 * @module VendorController
 * @description Generated Fabrix.js Controller.
 */
export class VendorController extends Controller {
  /**
   * upload CSV
   * @param req
   * @param res
   */
  uploadCSV(req, res) {
    const VendorCsvService = this.app.services.VendorCsvService
    const csv = req.file

    if (!csv) {
      const err = new Error('File failed to upload')
      return res.serverError(err)
    }

    VendorCsvService.vendorCsv(csv.path)
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
  findAll(req, res) {
    const orm = this.app.models
    const Vendor = orm['Vendor']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    const where = req.jsonCriteria(req.query.where)

    Vendor.findAndCountAll({
      where: where,
      order: sort,
      offset: offset,
      limit: limit,
      req: req
    })
      .then(vendors => {
        // Paginate
        res.paginate(vendors.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, vendors.rows)
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
    const Vendor = orm['Vendor']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['name', 'ASC']]
    const term = req.query.term
    const where = req.jsonCriteria(req.query.where)
    const defaults = _.defaults(where, {
      $or: [
        {
          name: {
            $iLike: `%${term}%`
          }
        }
      ]
    })
    Vendor.findAndCountAll({
      where: defaults,
      order: sort,
      offset: offset,
      req: req,
      limit: limit
    })
      .then(vendors => {
        // Paginate
        res.paginate(vendors.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, vendors.rows)
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
    const vendorId = req.params.id
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    if (!vendorId) {
      const err = new Error('A vendor id is required')
      return res.send(401, err)
    }

    // const Vendor = this.app.models['Vendor']
    const VendorProduct = this.app.models['VendorProduct']

    let count = 0

    VendorProduct.findAndCountAll({
      where: {
        vendor_id: vendorId
      },
      attributes: ['product_id'],
      limit: limit,
      offset: offset
    })
      .then(arr => {
        count = arr.count
        const productIds = arr.rows.map(model => model.product_id)
        return Product.findAllDefault({
          where: {
            id: productIds
          },
          req: req
        })
      })
      .then(products => {
        // Paginate
        res.paginate(count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, products)
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
    //       model: this.app.models['Vendor'],
    //       as: 'vendors',
    //       required: true,
    //       where: {
    //         id: vendorId
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
  processUpload(req, res) {
    const VendorCsvService = this.app.services.VendorCsvService
    VendorCsvService.processVendorUpload(req.params.id)
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
  // TODO
  exportVendors(req, res) {
    //
  }
}

