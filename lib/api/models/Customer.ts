import { FabrixApp } from '@fabrix/fabrix'
import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
import { isObject, isString, isNumber, defaultsDeep, pick, extend, values } from 'lodash'
import * as shortId from 'shortid'
import { Customer as CustomerQuery } from '../utils/queryDefaults'
import { CUSTOMER_STATE } from '../../enums'

export class CustomerResolver extends SequelizeResolver {
  /**
   *
   */
  findByIdDefault (id, options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      CustomerQuery.default(this.app),
      options
    )
    return this.findById(id, options)
  }
  /**
   *
   * @param token
   * @param options
   * @returns {*|Promise.<Instance>}
   */
  findByTokenDefault (token, options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      CustomerQuery.default(this.app),
      options,
      {
        where: {
          token: token
        }
      }
    )
    return this.findOne(options)
  }
  /**
   *
   */
  findAndCountDefault (options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      CustomerQuery.default(this.app),
      options || {},
      {distinct: true}
    )
    return this.findAndCountAll(options)
  }
  /**
   * Resolve by instance Function
   * @param cart
   * @param options
   */
  resolveByInstance (cart, options: {[key: string]: any} = {}) {
    return Promise.resolve(cart)
  }
  /**
   * Resolve by id Function
   * @param cart
   * @param options
   */
  resolveById (cart, options: {[key: string]: any} = {}) {
    return this.findById(cart.id, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart ${cart.id} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by token Function
   * @param cart
   * @param options
   */
  resolveByToken (cart, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        token: cart.token
      }
    }, options))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart token ${cart.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by email Function
   * @param cart
   * @param options
   */
  resolveByEmail (cart, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        email: cart.email
      }
    }, options))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart email ${cart.email} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by number Function
   * @param cart
   * @param options
   */
  resolveByNumber (cart, options: {[key: string]: any} = {}) {
    return this.findById(cart, options)
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart ${cart.token} not found`)
        }
        return resUser
      })
  }
  /**
   * Resolve by string Function
   * @param cart
   * @param options
   */
  resolveByString (cart, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        token: cart
      }
    }, options))
      .then(resUser => {
        if (!resUser && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Cart ${cart} not found`)
        }
        return resUser
      })
  }
  // /**
  //  * Primary Resolve Function
  //  * @param cart
  //  * @param options
  //  */
  // resolve(cart, options: {[key: string]: any} = {}) {
  //   options.create = options.create || true
  //   const resolvers = {
  //     'instance': cart instanceof this.instance,
  //     'id': !!(cart && isObject(cart) && cart.id),
  //     'token': !!(cart && isObject(cart) && cart.token),
  //     'create': !!(cart && isObject(cart) && options.create !== false)
  //     'number': !!(cart && isNumber(cart)),
  //     'string': !!(cart && isString(cart))
  //   }
  //   const type = Object.keys(resolvers).find((key) => resolvers[key])
  //
  //   switch (type) {
  //     case 'instance': {
  //       return this.resolveByInstance(cart, options)
  //     }
  //     case 'id': {
  //       return this.resolveById(cart, options)
  //     }
  //     case 'token': {
  //       return this.resolveByToken(cart, options)
  //     }
  //     case 'email': {
  //       return this.resolveByEmail(cart, options)
  //     }
  //     case 'create': {
  //       return this.create(cart, options)
  //     }
  //     case 'number': {
  //       return this.resolveByNumber(cart, options)
  //     }
  //     case 'string': {
  //       return this.resolveByString(cart, options)
  //     }
  //     default: {
  //       // TODO create proper error
  //       const err = new Error(`Unable to resolve Cart ${cart}`)
  //       return Promise.reject(err)
  //     }
  //   }
  // }
  /**
   * Resolves a Customer by instance or by identifier
   * @param customer
   * @param options
   * @returns {*}
   */
  resolve (customer, options: {[key: string]: any} = {}) {
    options.create = options.create || true

    const CustomerModel =  this
    if (customer instanceof CustomerModel.instance) {
      return Promise.resolve(customer)
    }
    else if (customer && isObject(customer) && customer.id) {
      return CustomerModel.findById(customer.id, options)
        .then(resCustomer => {
          if (!resCustomer && options.create !== false) {
            return this.app.services.CustomerService.create(customer, options)
          }
          return resCustomer
        })
    }
    else if (customer && isObject(customer) && customer.email) {
      return CustomerModel.findOne(
        this.app.services.SequelizeService.mergeOptionDefaults(
          options,
          {
            where: {
              email: customer.email
            }
          }
        )
      )
        .then(resCustomer => {
          if (!resCustomer && options.create !== false) {
            return this.app.services.CustomerService.create(customer, {transaction: options.transaction || null})
          }
          return resCustomer
        })
    }
    else if (customer && isNumber(customer)) {
      return CustomerModel.findById(customer, options)
    }
    else if (customer && isString(customer)) {
      return CustomerModel.findOne(
        this.app.services.SequelizeService.mergeOptionDefaults(
          options,
          {
            where: {
              email: customer
            }
          }
        )
      )
    }
    else if (options.create === false) {
      const err = new Error('Customer could not be resolved or created')
      return Promise.reject(err)
    }
    else {
      return this.app.services.CustomerService.create(customer, options)
    }
  }
}

/**
 * @module Customer
 * @description Customer Model
 */
export class Customer extends Model {

  static get resolver() {
    return CustomerResolver
  }

  static config (app, Sequelize) {

    return {
      options: {
        underscored: true,
        enums: {
          CUSTOMER_STATE: CUSTOMER_STATE
        },
        // defaultScope: {
        //   where: {
        //     live_mode: app.config.get('engine.live_mode')
        //   }
        // },
        scopes: {
          live: {
            where: {
              live_mode: true
            }
          }
        },
        hooks: {
          beforeCreate: [
            (customer, options) => {
              if (customer.ip) {
                customer.create_ip = customer.ip
              }
              // If not token was already created, create it
              if (!customer.token) {
                customer.token = `customer_${shortId.generate()}`
              }
            }
          ],
          beforeUpdate: [
            (customer, options) => {
              if (customer.ip) {
                customer.update_ip = customer.ip
              }
            }
          ],
          afterCreate: [
            (customer, options) => {
              return app.services.CustomerService.afterCreate(customer, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ],
          afterUpdate: [
            (customer, options) => {
              return app.services.CustomerService.afterUpdate(customer, options)
                .catch(err => {
                  return Promise.reject(err)
                })
            }
          ]
        },
        getterMethods: {
          full_name: function()  {
            if (this.first_name && this.last_name) {
              return `${ this.first_name } ${ this.last_name }`
            }
            else if (this.company) {
              return `${ this.company }`
            }
            else {
              return null
            }
          }
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // Unique identifier for a particular customer.
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      //
      accepts_marketing: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      // Customer First Name if not a Company
      first_name: {
        type: Sequelize.STRING
      },
      // Customer Last Name if not a Company
      last_name: {
        type: Sequelize.STRING
      },
      // Customer Company if not a User
      company: {
        type: Sequelize.STRING
      },
      // Customer Phone
      phone: {
        type: Sequelize.STRING
      },
      // Customers Email if there is one
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        },
        set: function(val) {
          return this.setDataValue('email', val ? val.toLowerCase() : null)
        }
      },
      //
      note: {
        type: Sequelize.STRING
      },
      // // The name of the Last order this Customer Placed
      last_order_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'Order',
        //   key: 'id'
        // }
      },
      last_order_name: {
        type: Sequelize.STRING
      },
      // TODO make this part of the Default Query
      // orders_count: {
      //   type: Sequelize.INTEGER,
      //   defaultValue: 0
      // },
      // The standing state of the customer: enabled, disabled, invited, declined
      state: {
        type: Sequelize.ENUM,
        values: values(CUSTOMER_STATE),
        defaultValue: CUSTOMER_STATE.ENABLED
      },

      type: {
        type: Sequelize.STRING,
        defaultValue: 'default'
      },

      // If customer is tax exempt
      tax_exempt: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // The total amount the customer has spent
      total_spent: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total amount the customer has spent
      avg_spent: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The total count of orders created
      total_orders: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The amount the customer has as a credit on their account
      account_balance: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      // If the customer's email address is verified
      verified_email: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      // Addresses
      default_address_id: {
        type: Sequelize.INTEGER
      },
      shipping_address_id: {
        type: Sequelize.INTEGER
      },
      billing_address_id: {
        type: Sequelize.INTEGER
      },

      // IP addresses
      ip: {
        type: Sequelize.STRING
      },
      create_ip: {
        type: Sequelize.STRING
      },
      update_ip: {
        type: Sequelize.STRING
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
    models.Customer.belongsToMany(models.User, {
      as: 'owners',
      through: {
        model: models.UserItem,

        scope: {
          item: 'cart'
        }
      },
      foreignKey: 'item_id',
      constraints: false
    })
    models.Customer.belongsToMany(models.Address, {
      as: 'addresses',
      // otherKey: 'address_id',
      foreignKey: 'model_id',
      through: {
        model: models.ItemAddress,
        scope: {
          model: 'customer'
        },
        constraints: false
      },
      constraints: false
    })
    models.Customer.belongsTo(models.Address, {
      as: 'shipping_address'
    })
    models.Customer.belongsTo(models.Address, {
      as: 'billing_address'
    })
    models.Customer.belongsTo(models.Address, {
      as: 'default_address'
    })
    models.Customer.belongsToMany(models.Order, {
      as: 'orders',
      through: {
        model: models.CustomerOrder,
        unique: true
      },
      foreignKey: 'customer_id'
    })

    models.Customer.belongsTo(models.Order, {
      as: 'last_order',
      foreignKey: 'last_order_id',
      constraints: false
    })

    models.Customer.belongsToMany(models.Tag, {
      as: 'tags',
      through: {
        model: models.ItemTag,
        unique: false,
        scope: {
          model: 'customer'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })
    models.Customer.belongsToMany(models.Collection, {
      as: 'collections',
      through: {
        model: models.ItemCollection,
        unique: false,
        scope: {
          model: 'customer'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })
    models.Customer.belongsToMany(models.Customer, {
      as: 'customers',
      through: {
        model: models.ItemCustomer,
        unique: false,
        scope: {
          model: 'customer'
        },
        constraints: false
      },
      foreignKey: 'model_id',
      otherKey: 'customer_id',
      constraints: false
    })
    models.Customer.hasOne(models.Metadata, {
      as: 'metadata',
      foreignKey: 'customer_id'
    })
    models.Customer.belongsToMany(models.Account, {
      as: 'accounts',
      through: {
        model: models.CustomerAccount,
        unique: false
      },
      foreignKey: 'customer_id'
    })
    models.Customer.belongsToMany(models.Source, {
      as: 'sources',
      through: {
        model: models.CustomerSource,
        unique: false
      },
      foreignKey: 'customer_id'
    })
    models.Customer.belongsToMany(models.User, {
      as: 'users',
      through: {
        model: models.CustomerUser,
        unique: true,
      },
      foreignKey: 'customer_id'
    })
    models.Customer.belongsToMany(models.Discount, {
      as: 'discounts',
      through: {
        model: models.ItemDiscount,
        unique: false,
        scope: {
          model: 'customer'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })
    models.Customer.hasOne(models.Cart, {
      as: 'default_cart',
      foreignKey: 'default_cart_id'
    })
    models.Customer.belongsToMany(models.Cart, {
      as: 'carts',
      through: {
        model: models.CustomerCart,
        unique: false
      },
      foreignKey: 'customer_id',
      constraints: false
    })
    models.Customer.hasMany(models.Event, {
      as: 'events',
      foreignKey: 'object_id',
      scope: {
        object: 'customer'
      },
      constraints: false
    })
    models.Customer.belongsToMany(models.Event, {
      as: 'event_items',
      through: {
        model: models.EventItem,
        unique: false,
        scope: {
          object: 'customer'
        }
      },
      foreignKey: 'object_id',
      constraints: false
    })
    models.Customer.belongsToMany(models.Image, {
      as: 'images',
      through: {
        model: models.ItemImage,
        unique: false,
        scope: {
          model: 'customer'
        },
        constraints: false
      },
      foreignKey: 'model_id',
      constraints: false
    })

    models.Customer.hasMany(models.DiscountEvent, {
      as: 'discount_events',
      foreignKey: 'customer_id'
    })
    models.Customer.hasMany(models.AccountEvent, {
      as: 'account_events',
      foreignKey: 'customer_id'
    })
    // models.Customer.hasOne(models.Order, {
    //   targetKey: 'last_order_id',
    //   foreignKey: 'id'
    // })
    // models.Customer.hasMany(models.Order, {
    //   as: 'orders',
    //   foreignKey: 'customer_id'
    // })
  }
}


export interface Customer {
  getProductHistory(product, options): any
  hasPurchaseHistory(productId, options): any
  isSubscribed(productId, options): any
  getSalutation(options): any
  getDefaultSource(options): any
  setLastOrder(order): any
  setTotalSpent(orderTotalDue): any
  setTotalOrders(): any
  setAvgSpent(): any
  setAccountBalance(newBalance): any
  logAccountBalance(type, price, currency, accountId, orderId, options): any
  notifyUsers(preNotification, options): any
  resolveCollections(options): any
  resolveDiscounts(options): any
  resolveMetadata(options): any
  resolveUsers(options): any
  resolveDefaultAddress(options): any
  resolveShippingAddress(options): any
  resolveBillingAddress(options): any
  resolvePaymentDetailsToSources(options): any
  sendRetargetEmail(options): any
  updateDefaultAddress(address, options): any
  updateShippingAddress(address, options): any
  updateBillingAddress(address, options): any
  toJSON(): any
}

/**
 *
 */
Customer.prototype.getProductHistory = function( product, options = {}) {
  let hasPurchaseHistory = false, isSubscribed = false
  return this.hasPurchaseHistory(product.id, options)
    .then(pHistory => {
      hasPurchaseHistory = pHistory
      return this.isSubscribed(product.id, options)
    })
    .then(pHistory => {
      isSubscribed = pHistory
      return {
        has_purchase_history: hasPurchaseHistory,
        is_subscribed: isSubscribed
      }
    })
    .catch(err => {
      return {
        has_purchase_history: hasPurchaseHistory,
        is_subscribed: isSubscribed
      }
    })
}
/**
 *
 */
Customer.prototype.hasPurchaseHistory = function(productId, options = {}) {
  return this.app.models['OrderItem'].findOne({
    where: {
      customer_id: this.id,
      product_id: productId,
      fulfillment_status: {
        $not: ['cancelled', 'pending', 'none']
      }
    },
    attributes: ['id'],
    transaction: options.transaction || null
  })
    .then(pHistory => {
      if (pHistory) {
        return true
      }
      else {
        return false
      }
    })
    .catch(err => {
      return false
    })
}

Customer.prototype.isSubscribed = function(productId, options = {}) {

  return this.app.models['Subscription'].findOne({
    where: {
      customer_id: this.id,
      active: true,
      line_items: {
        $contains: [{
          product_id: productId
        }]
      }
    },
    attributes: ['id'],
    transaction: options.transaction || null
  })
    .then(pHistory => {
      if (pHistory) {
        return true
      }
      else {
        return false
      }
    })
    .catch(err => {
      return false
    })
}

/**
 *
 * @param options
 * @returns {string}
 */
Customer.prototype.getSalutation = function(options = {}) {
  let salutation = 'Customer'

  if (this.full_name) {
    salutation = this.full_name
  }
  else if (this.email) {
    salutation = this.email
  }
  return salutation
}
/**
 *
 */
Customer.prototype.getDefaultSource = function(options: {[key: string]: any} = {}) {
  const Source = this.app.models['Source']
  return Source.findOne({
    where: {
      customer_id: this.id,
      is_default: true
    },
    transaction: options.transaction || null
  })
    .then(source => {
      // If there is no default, find one for the customer
      if (!source) {
        return Source.findOne({
          where: {
            customer_id: this.id
          },
          transaction: options.transaction || null
        })
      }
      else {
        return source
      }
    })
    .then(source => {
      return source
    })
}

/**
 *
 */
Customer.prototype.setLastOrder = function(order) {
  this.last_order_name = order.name
  this.last_order_id = order.id
  return this
}

/**
 *
 */
Customer.prototype.setTotalSpent = function(orderTotalDue) {
  this.total_spent = this.total_spent + orderTotalDue
  return this
}
/**
 *
 */
Customer.prototype.setTotalOrders = function() {
  this.total_orders = this.total_orders + 1
  return this
}
/**
 *
 */
Customer.prototype.setAvgSpent = function() {
  this.avg_spent = this.total_spent / this.total_orders
  return this
}
/**
 *
 */
// TODO Discussion: should this be pulled with each query or set after order?
Customer.prototype.setAccountBalance = function(newBalance) {
  this.account_balance = newBalance
  return this
}

/**
 *
 */
Customer.prototype.logAccountBalance = function(
  type = 'debit',
  price = 0,
  currency = 'USD',
  accountId,
  orderId,
  options: {[key: string]: any} = {}
) {

  return this.createAccount_event({
    type: type,
    price: price,
    account_id: accountId,
    order_id: orderId
  }, {
    transaction: options.transaction || null
  })
    .then(_event => {
      const currencySymbol = this.app.services.ProxyCartService.formatCurrency(price, currency)
      const event = {
        object_id: this.id,
        object: 'customer',
        objects: [{
          customer: this.id
        }],
        type: `customer.account_balance.${type}`,
        message: `Customer ${ this.email || 'ID ' + this.id } account balance was ${type}ed by ${ currencySymbol } ${currency}`,
        data: this
      }
      return this.app.services.EngineService.publish(event.type, event, {
        save: true,
        transaction: options.transaction || null
      })
    })
    .then(_event => {
      const newBalance = type === 'debit' ? Math.max(0, this.account_balance - price) : this.account_balance + price
      return this.setAccountBalance(newBalance)
    })

}
/**
 *
 */
Customer.prototype.notifyUsers = function(preNotification, options: {[key: string]: any} = {}) {

  return this.resolveUsers({
    attributes: ['id', 'email', 'username'],
    transaction: options.transaction || null,
    reload: options.reload || null,
  })
    .then(() => {
      if (this.users && this.users.length > 0) {
        return this.app.services.NotificationService.create(preNotification, this.users, {transaction: options.transaction || null})
          .then(notes => {
            this.app.log.debug('NOTIFY',
              this.id,
              this.email,
              this.users.map(u => u.id),
              preNotification.send_email,
              notes.users.map(u => u.id)
            )
            return notes
          })
      }
      else {
        return []
      }
    })
}
/**
 *
 */
Customer.prototype.resolveCollections = function(options: {[key: string]: any} = {}) {
  if (
    this.collections
    && this.collections.length > 0
    && this.collections.every(d => d instanceof this.app.models['Collection'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getCollections({transaction: options.transaction || null})
      .then(_collections => {
        _collections = _collections || []
        this.collections = _collections
        this.setDataValue('collections', _collections)
        this.set('collections', _collections)
        return this
      })
  }
}
/**
 *
 */
Customer.prototype.resolveDiscounts = function(options: {[key: string]: any} = {}) {
  if (
    this.discounts
    && this.discounts.length > 0
    && this.discounts.every(d => d instanceof this.app.models['Discount'].instance)
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
/**
 *
 */
Customer.prototype.resolveMetadata = function(options: {[key: string]: any} = {}) {
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
        _metadata = _metadata || {customer_id: this.id}
        this.metadata = _metadata
        this.setDataValue('metadata', _metadata)
        this.set('metadata', _metadata)
        return this
      })
  }
}
/**
 *
 */
Customer.prototype.resolveUsers = function(options: {[key: string]: any} = {}) {
  if (
    this.users
    && this.users.length > 0
    && this.users.every(u => u instanceof this.app.models['User'].instance)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getUsers({transaction: options.transaction || null})
      .then(_users => {
        _users = _users || []
        this.users = _users
        this.setDataValue('users', _users)
        this.set('users', _users)
        return this
      })
  }
}
/**
 *
 */
Customer.prototype.resolveDefaultAddress = function(options: {[key: string]: any} = {}) {
  if (
    this.default_address
    && this.default_address instanceof this.app.models['Address'].instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  // Some carts may not have a default address Id
  else if (!this.default_address_id) {
    this.default_address = this.app.models['Address'].build({})
    return Promise.resolve(this)
  }
  else {
    return this.getDefault_address({transaction: options.transaction || null})
      .then(address => {
        address = address || null
        this.default_address = address
        this.setDataValue('default_address', address)
        this.set('default_address', address)
        return this
      })
  }
}
/**
 *
 */
Customer.prototype.resolveShippingAddress = function(options: {[key: string]: any} = {}) {
  if (
    this.shipping_address
    && this.shipping_address instanceof this.app.models['Address'].instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  // Some carts may not have a shipping address Id
  else if (!this.shipping_address_id) {
    this.shipping_address = this.app.models['Address'].build({})
    return Promise.resolve(this)
  }
  else {
    return this.getShipping_address({transaction: options.transaction || null})
      .then(address => {
        address = address || null
        this.shipping_address = address
        this.setDataValue('shipping_address', address)
        this.set('shipping_address', address)
        return this
      })
  }
}
/**
 *
 */
Customer.prototype.resolveBillingAddress = function(options: {[key: string]: any} = {}) {
  if (
    this.billing_address
    && this.billing_address instanceof this.app.models['Address'].instance
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  // Some carts may not have a billing address Id
  else if (!this.billing_address_id) {
    this.billing_address = this.app.models['Address'].build({})
    return Promise.resolve(this)
  }
  else {
    return this.getBilling_address({transaction: options.transaction || null})
      .then(address => {
        address = address || null
        this.billing_address = address
        this.setDataValue('billing_address', address)
        this.set('billing_address', address)
        return this
      })
  }
}

// TODO
Customer.prototype.resolvePaymentDetailsToSources = (options = {}) => {
  return this
}

/**
 * Email to notify user's that there are pending items in cart
 */
Customer.prototype.sendRetargetEmail = function(options: {[key: string]: any} = {}) {

  return this.app.emails.Customer.retarget(this, {
    send_email: this.app.config.get('cart.emails.customerRetarget')
  }, {
    transaction: options.transaction || null
  })
    .then(email => {
      return this.notifyUsers(email, {transaction: options.transaction || null})
    })
    .catch(err => {
      this.app.log.error(err)
      return
    })
}

/**
 *
 */
Customer.prototype.updateDefaultAddress = function(address, options: {[key: string]: any } = {}) {
  const Address = this.app.models['Address']
  const defaultUpdate = Address.cleanAddress(address)

  return this.resolveDefaultAddress({transaction: options.transaction || null})
    .then(() => {
      // If this address has an ID, thenw e should try and update it
      if (address.id || address.token) {
        return Address.resolve(address, {transaction: options.transaction || null})
          .then(_address => {
            return _address.update(defaultUpdate, {transaction: options.transaction || null})
          })
      }
      else {
        return this.default_address
          .merge(defaultUpdate)
          .save({transaction: options.transaction || null})
      }
    })
    .then(defaultAddress => {
      this.default_address = defaultAddress
      this.setDataValue('default_address', defaultAddress)
      this.set('default_address', defaultAddress)

      if (this.default_address_id !== defaultAddress.id) {
        return this.setDefault_address(defaultAddress.id, {transaction: options.transaction || null})
      }
      return this
    })
}
/**
 *
 */
Customer.prototype.updateShippingAddress = function(address, options: {[key: string]: any} = {}) {
  const Address = this.app.models['Address']
  const shippingUpdate = Address.cleanAddress(address)

  return this.resolveShippingAddress({transaction: options.transaction || null})
    .then(() => {
      // If this address has an ID, thenw e should try and update it
      if (address.id || address.token) {
        return Address.resolve(address, {transaction: options.transaction || null})
          .then(_address => {
            return _address.update(shippingUpdate, {transaction: options.transaction || null})
          })
      }
      else {
        return this.shipping_address
          .merge(shippingUpdate)
          .save({transaction: options.transaction || null})
      }
    })
    .then(shippingAddress => {
      this.shipping_address = shippingAddress
      this.setDataValue('shipping_address', shippingAddress)
      this.set('shipping_address', shippingAddress)

      if (this.shipping_address_id !== shippingAddress.id) {
        return this.setShipping_address(shippingAddress.id, {transaction: options.transaction || null})
      }
      return this
    })
}
/**
 *
 */
Customer.prototype.updateBillingAddress = function(address, options: {[key: string]: any} = {}) {
  const Address = this.app.models['Address']
  const billingUpdate = Address.cleanAddress(address)

  return this.resolveBillingAddress({transaction: options.transaction || null})
    .then(() => {
      // If this address has an ID, thenw e should try and update it
      if (address.id || address.token) {
        return Address.resolve(address, {transaction: options.transaction || null})
          .then(_address => {
            return _address.update(billingUpdate, {transaction: options.transaction || null})
          })
      }
      else {
        return this.billing_address
          .merge(billingUpdate)
          .save({transaction: options.transaction || null})
      }
    })
    .then(billingAddress => {
      this.billing_address = billingAddress
      this.setDataValue('billing_address', billingAddress)
      this.set('billing_address', billingAddress)

      if (this.billing_address_id !== billingAddress.id) {
        return this.setBilling_address(billingAddress.id, {transaction: options.transaction || null})
      }
      return this
    })
}

/**
 *
 */
Customer.prototype.toJSON = function() {
  const resp = this instanceof this.app.models['Customer'].instance ? this.get({ plain: true }) : this
  // Transform Tags to array on toJSON
  if (resp.tags) {
    resp.tags = resp.tags.map(tag => {
      if (isString(tag)) {
        return tag
      }
      return tag.name
    })
  }
  else {
    resp.tags = []
  }
  // Transform Metadata to plain on toJSON
  if (resp.metadata) {
    if (typeof resp.metadata.data !== 'undefined') {
      resp.metadata = resp.metadata.data
    }
  }
  else {
    resp.metadata = {}
  }
  return resp
}
