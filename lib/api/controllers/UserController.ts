import { UserController as PermissionsController } from '@fabrix/spool-permissions/dist/api/controllers'
/**
 * @module UserController
 * @description Generated Fabrix.js Controller.
 */
export class UserController extends PermissionsController {

  /**
   *
   * @param req
   * @param res
   */
  customer(req, res) {
    const Customer = this.app.models['Customer']
    const customerId = req.params.customer
    let userId = req.params.id
    if (!userId && req.user) {
      userId = req.user.id
    }
    if (!customerId || !userId || !req.user) {
      const err = new Error('A customer id and a customer in session are required')
      res.send(401, err)

    }
    // TODO, make this a strict relation
    Customer.findById(customerId)
      .then(customer => {
        return this.app.services.PermissionsService.sanitizeResult(req, customer)
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
    let userId = req.params.id

    if (!userId && req.user) {
      userId = req.user.id
    }
    if (!userId && !req.user) {
      const err = new Error('A user id or a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    // this.app.models['User'].findById(userId)
    //   .then(user => {
    //     return user.getCustomers()
    //   })
    //   .then(customers => {
    //     return res.json(customers)
    //   })
    Customer.findAndCountAll({
      // TODO fix for sqlite
      // order: sort,
      where: {
        '$users.id$': userId
      },
      include: [{
        model: this.app.models['User'].instance,
        as: 'users',
        attributes: ['id']
      }],
      offset: offset
      // TODO sequelize breaks if limit is set here
      // limit: limit
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
  shop(req, res) {
    const Shop = this.app.models['Shop']
    const shopId = req.params.shop
    let userId = req.params.id
    if (!userId && req.user) {
      userId = req.user.id
    }
    if (!shopId || !userId || !req.user) {
      const err = new Error('A shop id and a shop in session are required')
      res.send(401, err)

    }
    // TODO, make this a strict relation
    Shop.findById(shopId)
      .then(shop => {
        return this.app.services.PermissionsService.sanitizeResult(req, shop)
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
  shops(req, res) {
    const Shop = this.app.models['Shop']
    let userId = req.params.id

    if (!userId && req.user) {
      userId = req.user.id
    }
    if (!userId && !req.user) {
      const err = new Error('A user id or a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    // this.app.models['User'].findById(userId)
    //   .then(user => {
    //     return user.getShops()
    //   })
    //   .then(shops => {
    //     return res.json(shops)
    //   })
    Shop.findAndCountAll({
      // TODO fix for sqlite
      // order: sort,
      where: {
        '$users.id$': userId
      },
      include: [{
        model: this.app.models['User'].instance,
        as: 'users',
        attributes: ['id']
      }],
      offset: offset
      // TODO sequelize breaks if limit is set here
      // limit: limit
    })
      .then(shops => {
        // Paginate
        res.paginate(shops.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, shops.rows)
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
  reviews(req, res) {

  }

  /**
   *
   * @param req
   * @param res
   */
  passports(req, res) {
    const Passport = this.app.models['Passport']
    const userId = req.params.id

    if (!userId && !req.user) {
      const err = new Error('A user id and a user in session are required')
      return res.send(401, err)
    }

    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]

    Passport.findAndCountAll({
      user: sort,
      where: {
        user_id: userId
      },
      offset: offset,
      limit: limit
    })
      .then(passports => {
        // Paginate
        res.paginate(passports.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, passports.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
}

