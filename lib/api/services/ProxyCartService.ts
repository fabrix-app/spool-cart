import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
import * as _ from 'lodash'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { ValidationError } from '@fabrix/fabrix/dist/errors'
import { address as addressSchema } from '../../schemas/address'
import * as joi from 'joi'
import * as sharp from 'sharp'
import * as geolib from 'geolib'
import * as currencyFormatter from 'currency-formatter'
import * as removeMd from 'remove-markdown'
import * as stripTags from 'striptags'
import * as request from 'request'

import { initialize as initializeMiddleware } from '../../middleware/initialize'
import { authenticate as authenticateMiddleware } from '../../middleware/authenticate'
import { cart as cartMiddleware } from '../../middleware/cart'
import { customer as customerMiddleware } from '../../middleware/customer'
import { shop as shopMiddleware } from '../../middleware/shop'

/**
 * @module ProxyCartService
 * @description ProxyCart Service
 */
export class ProxyCartService extends Service {
  _key
  initialize
  authenticate
  cart
  customer
  shop

  constructor(app) {
    super(app)
    // Middleware exports
    this._key = 'cart'
    this.initialize = initializeMiddleware
    this.authenticate = authenticateMiddleware
    this.cart = cartMiddleware
    this.customer = customerMiddleware
    this.shop = shopMiddleware
  }

  notifyAdmins(preNotification, options: {[key: string]: any} = {}) {
    const User = this.app.models.User

    if (!preNotification) {
      return Promise.reject('No Notification to send to Admins')
    }

    return User.findAll({
      include: [
        {
          model: this.app.models['Role'].instance,
          as: 'roles',
          where: {
            name: 'admin'
          }
        }
      ]
    })
      .then(users => {
        if (!users || users.length === 0) {
          throw new Error('No Admins to send emails to')
        }
        return this.app.services.NotificationService.create(preNotification, users, {transaction: options.transaction || null})
          .then(notes => {
            this.app.log.debug('NOTIFY ADMINS', users.map(u => u.id), preNotification.send_email, notes.users.map(u => u.id))
            return notes
          })
      })
  }

  /**
   *
   * @param url
   * @returns {Promise}
   */
  downloadImage(url) {
    return new Promise((resolve, reject) => {
      const req = request.defaults({ encoding: null })
      req.get(url, (err, res, body) => {
        if (err) {
          this.app.log.error(err)
          return reject(err)
        }
        return resolve(body)
      })
    })
  }

  /**
   *
   * @param imageUrl
   * @param options
   * @returns {Promise}
   */
  buildImages(imageUrl, options) {
    return new Promise((resolve, reject) => {
      const images = {
        full: imageUrl,
        thumbnail: imageUrl,
        small: imageUrl,
        medium: imageUrl,
        large: imageUrl
      }
      let buffer

      this.downloadImage(imageUrl)
        .then(resBuffer => {
          buffer = resBuffer
          return sharp(buffer)
            .resize(200)
            .toBuffer()
        })
        .then(thumbnailBuffer => {
          return this.uploadImage(thumbnailBuffer, images.thumbnail)
        })
        .then(thumbnail => {
          images.thumbnail = thumbnail.url
          return sharp(buffer)
            .resize(300)
            .toBuffer()
        })
        .then(smallBuffer => {
          return this.uploadImage(smallBuffer, images.small)
        })
        .then(small => {
          images.small = small.url
          return sharp(buffer)
            .resize(400)
            .toBuffer()
        })
        .then(mediumBuffer => {
          return this.uploadImage(mediumBuffer, images.medium)
        })
        .then(medium => {
          images.medium = medium.url
          return sharp(buffer)
            .resize(500)
            .toBuffer()
        })
        .then(largeBuffer => {
          return this.uploadImage(largeBuffer, images.large)
        })
        .then((large) => {
          images.large = large.url
          return resolve(images)
        })
        .catch((err) => {
          this.app.log.error(err)
          return resolve(images)
        })
    })
  }

  /**
   *
   * @param image
   * @param orgUrl
   * @returns {*}
   */
  uploadImage(image, orgUrl) {
    return this.app.services.DataStoreGenericService.upload(image)
      .catch(err => {
        return {
          url: orgUrl
        }
      })
  }

  /**
   *
   * @param text
   * @returns {string|null}
   */
  handle(text) {
    if (!text) {
      return null
    }
    return text.toString().trim()
      // .replace(/(\r\n|\n|\r)/g,'')    // Replace new lines
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/&/g, '-and-')         // Replace & with 'and'
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars but hyphens
      .replace(/\-\-+/g, '-')         // Remove double hyphens
      .toLowerCase()                  // Make lowercase
      .substring(0, 255)              // Allow only 255 characters
  }

  /**
   *
   * @param text
   * @returns {string|null}
   */
  splitHandle(text) {
    if (!text) {
      return null
    }
    return text.toString().trim()
      // .replace(/(\r\n|\n|\r)/g, '')   // Replace new lines
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/&/g, '-and-')         // Replace & with 'and'
      .replace(/[^\w:\-]+/g, '')      // Remove all non-word chars but colons and hyphens
      .replace(/\-\-+/g, '-')         // Remove double hyphens
      .toLowerCase()                  // Make Lowercase

  }

  /**
   *
   * @param text
   * @returns {string|null}
   */
  sku(text) {
    if (!text) {
      return null
    }
    text = text.toString().trim()
      .replace(/[^\w:\-]+/g, '')      // Remove all non-word chars but colons and hyphens
    return removeMd(stripTags(text)).toString()
  }

  /**
   *
   * @param text
   * @returns {string|null}
   */
  title(text) {
    if (!text) {
      return null
    }
    text = text.toString().trim()
    return removeMd(stripTags(text)).toString().substring(0, 255)
  }

  /**
   *
   * @param text
   * @returns {string|null}
   */
  name(text) {
    if (!text) {
      return null
    }
    text = text.toString().trim()
    return removeMd(stripTags(text)).toString().toLowerCase().substring(0, 255)
  }

  /**
   *
   * @param text
   * @returns {string|null}
   */
  description(text) {
    if (!text) {
      return null
    }
    text = text.toString().trim()
    return removeMd(stripTags(text)).toString()
  }
  /**
   *
   * @param ounces
   * @returns {number}
   */
  ouncesToGrams(ounces) {
    return ounces * 28.3495231
  }

  /**
   *
   * @param pounds
   * @returns {number}
   */
  poundsToGrams(pounds) {
    return pounds * 16 * 28.3495231
  }

  /**
   *
   * @param kilogram
   * @returns {number}
   */
  kilogramsToGrams(kilogram) {
    return kilogram / 1000
  }

  /**
   *
   * @param weight
   * @param weightUnit
   * @returns {*}
   */
  resolveConversion(weight, weightUnit) {
    switch (weightUnit) {
    case 'kg':
      return this.kilogramsToGrams(weight)
    case 'oz':
      return this.ouncesToGrams(weight)
    case 'lb':
      return this.poundsToGrams(weight)
    default:
      return weight
    }
  }

  /**
   *
   * @param str
   * @returns {boolean}
   */
  isJson(str) {
    try {
      JSON.parse(str)
    }
    catch (e) {
      return false
    }
    return true
  }

  /**
   *
   * @param num
   * @param currency
   * @returns {*}
   */
  formatCurrency(num, currency) {
    currency = currency || this.app.config.get('cart.default_currency')
    return currencyFormatter.format(num / 100, { code: currency.toUpperCase() })
  }
  /**
   *
   * @param address
   * @returns {*}
   */
  validateAddress(address) {
    try {
      joi.validate(address, addressSchema)
    }
    catch (err) {
      throw new ValidationError(err)
    }
    try {
      address = this.normalizeAddress(address)
    }
    catch (err) {
      throw new Error(err)
    }
    return address
  }

  /**
   *
   * @param address
   * @returns {*}
   */
  normalizeAddress(address: {[key: string]: any} = {}) {
    const CartCountryService = this.app.services.CartCountryService
    const Address = this.app.models['Address']
    const countryNorm = address.country_code || address.country || address.country_name
    const provinceNorm = address.province_code || address.province
    let normalizedProvince, ext

    if (!provinceNorm || !countryNorm) {
      // throw new Error(`Unable to normalize ${provinceNorm}, ${countryNorm}`)
      return address
    }

    normalizedProvince  = CartCountryService.province(countryNorm, provinceNorm)

    if (!normalizedProvince) {
      throw new Error(`Unable to normalize ${provinceNorm}, ${countryNorm}`)
    }

    ext = {
      country: normalizedProvince.country.name,
      country_name: normalizedProvince.country.name,
      country_code: normalizedProvince.country.ISO.alpha2,
      province: normalizedProvince.name,
      province_code: normalizedProvince.code
    }
    if (address instanceof Address.instance) {
      address = address.merge(ext)
    }
    else {
      address = _.merge(address, ext)
    }

    return address
  }

  /**
   * Converts a currency with a decimal to it's exponent of 0's following the decimal
   * @param amount
   * @returns number
   */
  normalizeCurrency(amount) {
    if (!_.isNumber(amount) || _.isNil(amount)) {
      throw new Error('Amount must be a number')
    }
    const amountString = amount.toString().split('.')
    if (amountString[1]) {
      const exponent = amountString[1].length
      amount = amount * Math.pow(10, exponent)
    }
    return amount
  }

  /**
   *
   * @param obj
   * @param shippingAddress
   * @param options
   * @returns {Promise}
   */
  // TODO
  resolveSendFromTo(obj, shippingAddress, options) {
    options = options || {}
    return new Promise((resolve, reject) => {
      const Cart = this.app.models['Cart']
      const Subscription = this.app.models['Subscription']
      const Customer = this.app.models['Customer']
      const Shop = this.app.models['Shop']
      const Address = this.app.models['Address']

      if (!(obj instanceof Cart.instance) && !(obj instanceof Subscription.instance)) {
        const err = new Error('Object must be an instance!')
        return reject(err)
      }

      Shop.findById(obj.shop_id, {
        include: [
          {
            model: Address.instance,
            as: 'address'
          },
        ],
        transaction: options.transaction || null
      })
        .then(shop => {
          if (!shop || !shop.address) {
            return resolve(null)
          }
          const from = {
            shop_id: shop.id,
            name: shop.name,
            address_1: shop.address.address_1,
            address_2: shop.address.address_2,
            address_3: shop.address.address_3,
            company: shop.address.company,
            city: shop.address.city,
            province: shop.address.province,
            province_code: shop.address.province_code,
            country: shop.address.country,
            country_name: shop.address.country_name,
            country_code: shop.address.country_code
          }
          // If provided a shipping address
          if (shippingAddress && this.app.services.ProxyCartService.validateAddress(shippingAddress)) {
            const res = {
              to: shippingAddress,
              from: from
            }
            return resolve(res)
          }
          else if (obj.shipping_address_id) {
            Address.findById(obj.shipping_address_id)
              .then(address => {
                const to = address.get({plain: true})
                const res = {
                  to: to,
                  from: from
                }
                return resolve(res)
              })
              .catch(err => {
                return reject(err)
              })
          }
          else if (obj.customer_id) {
            Customer.findById(obj.customer_id, {
              attributes: ['id'],
              include: [
                {
                  model: Address.instance,
                  as: 'default_address'
                },
                {
                  model: Address.instance,
                  as: 'shipping_address'
                }
              ],
              transaction: options.transaction || null
            })
              .then(customer => {

                if ( customer.shipping_address instanceof Address.instance) {
                  customer.shipping_address = customer.shipping_address.get({plain: true})
                }
                if ( customer.default_address instanceof Address.instance) {
                  customer.default_address = customer.default_address.get({plain: true})
                }
                const to = customer.shipping_address ? customer.shipping_address : customer.default_address
                const res = {
                  to: to,
                  from: from
                }
                return resolve(res)
              })
              .catch(err => {
                return reject(err)
              })
          }
          else {
            return resolve(null)
          }
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  /**
   *
   * @param obj
   * @param lineItems
   * @param shippingAddress
   * @param options
   * @returns {Promise}
   */
  resolveItemsFromTo(obj, lineItems, shippingAddress, options: {[key: string]: any} = {}) {

    const Cart = this.app.models['Cart']
    const Order = this.app.models['Order']
    const Subscription = this.app.models['Subscription']
    const Customer = this.app.models['Customer']
    const Shop = this.app.models['Shop']
    const Address = this.app.models['Address']

    if (!(obj instanceof Cart.instance) && !(obj instanceof Subscription.instance) && !(obj instanceof Order.instance)) {
      throw new Error('Object must be an instance of a Cart, Subscription or Order!')
    }

    let nexuses, to

    return Promise.resolve()
      .then(() => {
        // If provided a shipping address
        if (shippingAddress && this.app.services.ProxyCartService.validateAddress(shippingAddress)) {
          return shippingAddress
        }
        else if (obj.shipping_address_id) {
          return Address.findById(obj.shipping_address_id)
            .then(address => {
              return address.get({plain: true})
            })
        }
        else if (obj.customer_id) {
          return Customer.findById(obj.customer_id, {
            attributes: ['id'],
            include: [
              {
                model: Address.instance,
                as: 'default_address'
              },
              {
                model: Address.instance,
                as: 'shipping_address'
              }
            ],
            transaction: options.transaction || null
          })
            .then(customer => {

              if ( customer.shipping_address instanceof Address.instance) {
                customer.shipping_address = customer.shipping_address.get({plain: true})
              }
              if ( customer.default_address instanceof Address.instance) {
                customer.default_address = customer.default_address.get({plain: true})
              }
              return customer.shipping_address ? customer.shipping_address : customer.default_address
            })
        }
        else {
          return
        }
      })
      .then(_to => {
        if (!_to) {
          return
        }
        else {
          to = _to
          return Shop.sequelize.Promise.mapSeries(lineItems, item => {
            return this.resolveItemNexusTo(item, to, {transaction: options.transaction || null})
          })
        }
      })
      .then(_nexuses => {
        if (!_nexuses) {
          return _nexuses
        }
        // If nothing came back, but we should attempt to use the default store.
        else if (_nexuses.filter(n => n).length === 0) {
          return Shop.findById(obj.shop_id, {
            attributes: ['id', 'name', 'address_id'],
            include: [
              {
                model: Address.instance,
                as: 'address'
              },
            ],
            transaction: options.transaction || null
          })
            .then(_shop => {

              if (!_shop || !_shop.address) {
                return null
              }

              _nexuses[0] = {
                shop_id: _shop.id,
                name: _shop.name,
                address_1: _shop.address.address_1,
                address_2: _shop.address.address_2,
                address_3: _shop.address.address_3,
                company: _shop.address.company,
                city: _shop.address.city,
                province: _shop.address.province,
                province_code: _shop.address.province_code,
                postal_code: _shop.address.postal_code,
                country: _shop.address.country,
                country_name: _shop.address.country_name,
                country_code: _shop.address.country_code
              }
              // Filter out all the null nexuses
              return _nexuses.filter(n => n)
            })
            .catch(err => {
              this.app.log.error(err)
              return
            })
        }
        else {
          // Filter out all the null nexuses
          return _.uniqBy(_nexuses, 'shop_id').filter(n => n)
        }
      })
      .then(_nexuses => {
        if (_nexuses) {
          nexuses = _nexuses
        }
        if (!nexuses || _nexuses.length === 0 || !to) {
          return null
        }
        else  {
          // console.log('BRK!', nexuses)
          return {
            nexus_addresses: nexuses,
            to_address: to
          }
        }
      })
  }

  /**
   * Resolves what shop address an item is shipping from
   * @param item
   * @param to
   * @param options
   * @returns {Promise.<T>}
   */
  resolveItemNexusTo(item, to, options: {[key: string]: any} = {}) {
    const Shop = this.app.models['Shop']
    const Address = this.app.models['Address']
    if (!item.shop_id) {
      return Promise.resolve(null)
    }
    // // TODO!
    else if (!this.app.config.get('scott.awesome')) {
      return Promise.resolve(null)
    }
    // Find a nexus from item shop id if present
    return Shop.findById(item.shop_id, {
      include: [
        {
          model: Address.instance,
          as: 'address'
        }
      ],
      transaction: options.transaction || null
    })
      .then(_shop => {
        if (!_shop || !_shop.address) {
          return null
        }

        return {
          shop_id: _shop.id,
          item_id: item.id,
          name: _shop.name,
          address_1: _shop.address.address_1,
          address_2: _shop.address.address_2,
          address_3: _shop.address.address_3,
          company: _shop.address.company,
          city: _shop.address.city,
          province: _shop.address.province,
          province_code: _shop.address.province_code,
          country: _shop.address.country,
          country_name: _shop.address.country_name,
          country_code: _shop.address.country_code
        }
      })
      .catch(err => {
        return null
      })
  }

  /**
   *
   * @param shops
   * @param address
   * @returns {Array|*}
   */
  nearestToAddress(shops, address) {
    shops = _.map(shops, shop => {
      shop.distance = geolib.getDistance(
        {
          latitude: shop.latitude,
          longitude: shop.longitude
        },
        {
          latitude: address.latitude,
          longitude: address.longitude
        }
      )
      return shop
    })
    shops = _.sortBy(shops, 'distance')

    return shops
  }

  /**
   *
   * @param user
   * @param options
   * @returns {Promise.<T>}
   */
  afterUserCreate(user, options: {[key: string]: any} = {}) {
    const Customer = this.app.models['Customer']
    const Cart = this.app.models['Cart']
    // return Promise.resolve(user)

    return Customer.resolve({
      id: user.current_customer_id,
      email: user.email,
      phone: user.phone,
      first_name: user.first_name,
      last_name: user.last_name,
      accepts_marketing: user.accepts_marketing,
      users: [user]
    }, {
      transaction: options.transaction || null,
      create: true
    })
      .then(customer => {
        if (!customer) {
          return {
            id: null
          }
        }
        // Set the user's current customer id
        user.current_customer_id = customer.id
        // Update the customer email address if it doesn't already have one
        if (!customer.email && user.email) {
          customer.email = user.email
        }
        return this.app.services.CustomerService.addUser(customer, user, {transaction: options.transaction || null})
          .then(() => {
            return customer.save({transaction: options.transaction || null})
          })
      })
      .then(customer => {
        return Cart.resolve({
          id: user.current_cart_id,
          customer: customer.id
        }, {
          transaction: options.transaction || null
        })
      })
      .then(cart => {
        // Set the user's current cart id
        user.current_cart_id = cart.id

        return user.save({
          fields: [
            'current_cart_id',
            'current_customer_id'
          ],
          transaction: options.transaction || null
        })
      })
  }

  /**
   *
   * @param cart
   * @param next
   */
  serializeCart(cart, next) {
    if (typeof next !== 'function') {
      throw new Error('instance#serializeCart requires a callback function')
    }
    next(null, cart.id)
  }

  /**
   *
   * @param id
   * @param options
   * @param next
   */
  deserializeCart(id, options, next) {
    options = options || {}
    if (typeof next !== 'function') {
      throw new Error('instance#deserializeCart requires a callback function')
    }
    this.app.models['Cart'].findById(id, {transaction: options.transaction || null})
      .then(cart => {
        next(null, cart)
      })
      .catch(err => {
        next(err)
      })
  }

  /**
   *
   * @param customer
   * @param next
   */
  serializeCustomer(customer, next) {
    if (typeof next !== 'function') {
      throw new Error('instance#serializeCustomer requires a callback function')
    }
    next(null, customer.id)
  }

  /**
   *
   * @param id
   * @param options
   * @param next
   */
  deserializeCustomer(id, options, next) {
    options = options || {}
    if (typeof next !== 'function') {
      throw new Error('instance#deserializeCustomer requires a callback function')
    }
    this.app.models['Customer'].findById(id, {transaction: options.transaction || null})
      .then(customer => {
        next(null, customer)
      })
      .catch(err => {
        next(err)
      })
  }

  /**
   *
   * @param shop
   * @param next
   */
  serializeShop(shop, next) {
    if (typeof next !== 'function') {
      throw new Error('instance#serializeShop requires a callback function')
    }
    next(null, shop.id)
  }

  /**
   *
   * @param id
   * @param options
   * @param next
   */
  deserializeShop(id, options, next) {
    options = options || {}
    if (typeof next !== 'function') {
      throw new Error('instance#deserializeShop requires a callback function')
    }
    this.app.models['Shop'].findById(id, {transaction: options.transaction || null})
      .then(shop => {
        next(null, shop)
      })
      .catch(err => {
        next(err)
      })
  }

}

