import { FabrixController as Controller } from '@fabrix/fabrix/dist/common'
import * as Validator from '../../validator'
// import { ModelError } from '@fabrix/spool-sequelize/dist/errors'

/**
 * @module ShopController
 * @description Shop Controller.
 */
export class ShopController extends Controller {
  generalStats(req, res) {
    res.json({})
  }
  /**
   * count the amount of shops
   * @param req
   * @param res
   */
  count(req, res) {
    const EventsService = this.app.services.EventsService
    EventsService.count('Shop')
      .then(count => {
        const counts = {
          shops: count
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
  findAll(req, res) {
    const orm = this.app.models
    const Shop = orm['Shop']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    const where = req.jsonCriteria(req.query.where)

    Shop.findAndCountAll({
      where: where,
      order: sort,
      offset: offset,
      limit: limit,
      req: req
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
  create(req, res) {
    const ShopService = this.app.services.ShopService
    Validator.validateShop.create(req.body)
      .then(values => {
        return ShopService.create(req.body)
      })
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
  update(req, res) {
    const ShopService = this.app.services.ShopService
    const id = req.params.id

    Validator.validateShop.update(req.body)
      .then(values => {
        return ShopService.update(id, req.body)
      })
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


  addCustomer(req, res) {

  }
  removeCustomer(req, res) {

  }
  customers(req, res) {

  }

  addOrder(req, res) {

  }
  removeOrder(req, res) {

  }
  orders(req, res) {

  }

  addProduct(req, res) {

  }
  removeProduct(req, res) {

  }
  products(req, res) {

  }

  addUser(req, res) {

  }
  removeUser(req, res) {

  }
  users(req, res) {

  }


  /**
   *
   * @param req
   * @param res
   */
  login(req, res) {
    let shopId = req.params.id
    const Shop = this.app.models['Shop']
    const User = this.app.models['User']

    if (!shopId && req.user) {
      shopId = req.user.current_shop_id
    }

    if (!shopId && !req.user) {
      const err = new Error('A shop id and a user in session are required')
      return res.send(401, err)
    }
    let resShop
    Shop.findById(shopId)
      .then(shop => {
        if (!shop) {
          throw new Error('Unexpected Error while authenticating shop')
        }
        resShop = shop
        return new Promise((resolve, reject) => {
          req.loginShop(resShop, function (err) {
            if (err) {
              return reject(err)
            }
            return resolve(resShop)
          })
        })
      })
      .then((shop) => {
        return User.findById(req.user.id, { attributes: ['id', 'current_shop_id']})
          .then(user => {
            user.current_shop_id = resShop.id
            return user.save()
          })
      })
      .then(() => {
        return this.app.services.PermissionsService.sanitizeResult(req, resShop)
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
  switchShop(req, res) {
    const shopId = req.params.id
    const Shop = this.app.models['Shop']
    const User = this.app.models['User']

    if (!shopId && !req.user) {
      const err = new Error('A shop id and a user in session are required')
      return res.send(401, err)
    }
    User.findById(req.user.id, { attributes: ['id', 'current_shop_id']})
      .then(user => {
        user.current_shop_id = shopId
        return user.save()
      })
      .then(user => {
        return Shop.findById(shopId)
      })
      .then(shop => {
        return new Promise((resolve, reject) => {
          req.loginShop(shop, (err) => {
            if (err) {
              return reject(err)
            }
            return resolve(shop)
          })
        })
      })
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
  logout(req, res) {
    const User = this.app.models['User']
    if (!req.user) {
      const err = new Error('A user in session is required')
      return res.send(401, err)
    }

    User.findById(req.user.id, { attributes: ['id', 'current_shop_id']})
      .then(user => {
        user.current_shop_id = null
        return user.save()
      })
      .then(() => {
        req.logoutShop()
        res.sendStatus(200)
      })
  }
}

