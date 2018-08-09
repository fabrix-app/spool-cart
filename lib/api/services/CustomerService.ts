import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
import * as _ from 'lodash'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'

import { CUSTOMER_STATE } from '../../enums'

/**
 * @module CustomerService
 * @description Customer Service
 */
export class CustomerService extends Service {

  /**
   *
   * @param customer
   * @param options
   * @returns {Promise}
   */
  create(customer, options) {
    options = options || {}
    const Account = this.app.models['Account']
    const Address = this.app.models['Address']
    const Cart = this.app.models['Cart']
    const Customer = this.app.models['Customer']
    const Metadata = this.app.models['Metadata']
    const Tag = this.app.models['Tag']
    const User = this.app.models['User']

    if (customer.cart) {
      customer.default_cart = customer.cart
      delete customer.cart
    }

    // Resolve all Address if any are provided
    if (!customer.default_address && customer.shipping_address) {
      customer.default_address = customer.shipping_address
    }
    if (!customer.shipping_address && customer.default_address) {
      customer.shipping_address = customer.default_address
    }
    if (!customer.billing_address && customer.default_address) {
      customer.billing_address = customer.default_address
    }

    let resCustomer

    return Customer.create({
      // const create = Customer.build({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      note: customer.note,
      accepts_marketing: customer.accepts_marketing,
      state: customer.state,
      tax_exempt: customer.tax_exempt,
      verified_email: customer.verified_email,
      metadata: Metadata.transform(customer.metadata || {}),
      account_balance: customer.account_balance
    }, {
      include: [
        {
          model: Address.instance,
          as: 'shipping_address'
        },
        {
          model: Address.instance,
          as: 'billing_address'
        },
        {
          model: Address.instance,
          as: 'default_address'
        },
        {
          model: Cart.instance,
          as: 'default_cart'
        },
        {
          model: Tag.instance,
          as: 'tags'
        },
        {
          model: Metadata.instance,
          as: 'metadata'
        },
        // {
        //   model: User,
        //   as: 'users'
        // }
      ],
      transaction: options.transaction || null
    })
    .then(_customer => {

    // return create.save({transaction: options.transaction || null})
    //   .then(_customer => {
        if (!_customer) {
          throw new Error('Customer could not be created')
        }
        resCustomer = _customer

        // Shipping Address
        if (customer.shipping_address && !_.isEmpty(customer.shipping_address)) {
          return resCustomer.updateShippingAddress(
            customer.shipping_address,
            {transaction: options.transaction || null}
          )
        }
        return
      })
      .then(() => {
        // Billing Address
        if (customer.billing_address && !_.isEmpty(customer.billing_address)) {
          return resCustomer.updateBillingAddress(
            customer.billing_address,
            {transaction: options.transaction || null}
          )
        }
        return
      })
      .then(() => {
        // Default Address
        if (customer.default_address && !_.isEmpty(customer.default_address)) {
          return resCustomer.updateDefaultAddress(
            customer.default_address,
            {transaction: options.transaction || null}
          )
        }
        return
      })
      .then(() => {
        // Tags
        if (customer.tags && customer.tags.length > 0) {
          customer.tags = _.sortedUniq(customer.tags.filter(n => n))
          return Tag.transformTags(customer.tags, {transaction: options.transaction || null})
        }
        return
      })
      .then(tags => {
        // Add Tags
        if (tags && tags.length > 0) {
          return resCustomer.setTags(tags.map(tag => tag.id), {transaction: options.transaction || null})
        }
        return
      })
      .then(tags => {
        if (customer.default_cart) {
          // Resolve the Cart
          return Cart.resolve(customer.default_cart, {transaction: options.transaction || null})
        }
        return
      })
      .then(cart => {
        if (cart) {
          // Set this cart as the default cart
          return resCustomer.setDefault_cart(cart.id, {transaction: options.transaction || null})
        }
      })
      .then(cart => {
        if (customer.accounts && customer.accounts.length > 0) {
          return Customer.sequelize.Promise.mapSeries(customer.accounts, account => {
            account.customer_id = resCustomer.id
            account.email = resCustomer.email
            return this.app.services.AccountService.findAndCreate(
              account,
              {
                transaction: options.transaction || null
              }
            )
          })
        }
        else {
          return this.app.services.PaymentGenericService.createCustomer(resCustomer)
            .then(serviceCustomer => {
              // const Account = this.app.models['Account']
              // const CustomerAccount = this.app.models['CustomerAccount']
              let resAccount
              return Account.create({
                customer_id: resCustomer.id,
                email: resCustomer.email,
                is_default: true,
                gateway: serviceCustomer.gateway,
                foreign_id: serviceCustomer.foreign_id,
                foreign_key: serviceCustomer.foreign_key,
                data: serviceCustomer.data
              }, {
                transaction: options.transaction || null
              })
                .then(account => {
                  if (!account) {
                    throw new Error('Account was not created')
                  }
                  resAccount = account
                  // Track Event
                  const event = {
                    object_id: account.customer_id,
                    object: 'customer',
                    objects: [{
                      customer: account.customer_id
                    }, {
                      account: account.id
                    }],
                    type: 'customer.account.created',
                    message: `Customer account ${account.foreign_id} created on ${ account.gateway }`,
                    data: account
                  }
                  return this.app.services.EngineService.publish(event.type, event, {
                    save: true,
                    transaction: options.transaction || null
                  })
                })
                .then(event => {
                  return [resAccount]
                })
            })
        }
      })
      .then(accounts => {
        if (accounts && accounts.length > 0) {
          return resCustomer.setAccounts(accounts.map(account => account.id), {
            transaction: options.transaction || null
          })
        }
        return
      })
      .then(accounts => {

        if (customer.users && customer.users.length > 0) {
          return Customer.sequelize.Promise.mapSeries(customer.users, user => {
            // Setup some defaults
            user.current_customer_id = resCustomer.id

            // If user exists, then update
            if (user instanceof User.instance) {
              return user.save({transaction: options.transaction || null})
            }

            // Create a new password
            user.passports = {
              protocol: 'local'
            }

            return User.create(user, {
              include: [
                {
                  model: this.app.models['Passport'].instance,
                  as: 'passports'
                }
              ],
              transaction: options.transaction || null
            })
          })
        }
        return []
      })
      .then(users => {
        if (users && users.length > 0) {
          return resCustomer.setUsers(users.map(user => user.id), {
            transaction: options.transaction || null
          })
        }
        return []
      })
      .then(users => {
        const event = {
          object_id: resCustomer.id,
          object: 'customer',
          objects: [{
            customer: resCustomer.id
          }],
          type: 'customer.created',
          message: `Customer ${ resCustomer.email || 'ID ' + resCustomer.id} created`,
          data: resCustomer
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        // return resCustomer.reload()
        return Customer.findByIdDefault(resCustomer.id, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param customer
   * @param options
   * @returns {Promise}
   */
  update(customer, options) {
    options = options || {}
    const Customer = this.app.models['Customer']
    const Tag = this.app.models['Tag']

    if (!customer.id) {
      const err = new ModelError('E_NOT_FOUND', 'Customer is missing id')
      return Promise.reject(err)
    }

    let resCustomer
    return Customer.findByIdDefault(customer.id, options)
      .then(_customer => {
        if (!_customer) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCustomer = _customer
        const update = _.omit(customer, ['tags', 'metadata', 'shipping_address', 'billing_address', 'default_address'])
        return resCustomer.update(update)
      })
      .then(updatedCustomer => {
        if (customer.tags && customer.tags.length > 0) {
          customer.tags = _.sortedUniq(customer.tags.filter(n => n))
          return Tag.transformTags(customer.tags, {transaction: options.transaction || null})
        }
        return
      })
      .then(tags => {
        if (tags && tags.length > 0) {
          return resCustomer.setTags(tags.map(tag => tag.id), {transaction: options.transaction || null})
        }
        return
      })
      .then(() => {
        // Save Changes to metadata
        if (customer.metadata) {
          resCustomer.metadata.data = customer.metadata || {}
          return resCustomer.metadata.save({transaction: options.transaction || null})
        }
        return
      })
      .then(() => {
        if (customer.shipping_address) {
          return resCustomer.updateShippingAddress(
            customer.shipping_address,
            {transaction: options.transaction || null}
          )
        }
        return
      })
      .then(() => {
        if (customer.billing_address) {
          return resCustomer.updateBillingAddress(
            customer.billing_address,
            {transaction: options.transaction || null}
          )
        }
        return
      })
      .then(() => {
        if (customer.default_address) {
          return resCustomer.updateDefaultAddress(
            customer.default_address,
            {transaction: options.transaction || null}
          )
        }
        return
      })
      .then(defaultAddress => {
        // return resCustomer.reload()
        const event = {
          object_id: resCustomer.id,
          object: 'customer',
          objects: [{
            customer: resCustomer.id
          }],
          type: 'customer.updated',
          message: `Customer ${ resCustomer.email || 'ID ' + resCustomer.id } updated`,
          data: resCustomer
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        return Customer.findByIdDefault(resCustomer.id, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param customer
   * @param options
   * @returns {*}
   */
  accountBalance(customer, options: {[key: string]: any} = {}) {
    const Customer = this.app.models.Customer
    let price = 0
    let type = 'credit'

    if (!customer.id) {
      const err = new ModelError('E_NOT_FOUND', 'Customer is missing id')
      return Promise.reject(err)
    }

    let resCustomer
    return Customer.resolve(customer, {
      transaction: options.transaction || null,
      create: false
    })
      .then(_customer => {
        if (!_customer) {
          throw new ModelError('E_NOT_FOUND', 'Customer was not found')
        }
        if (!(_customer instanceof Customer.instance)) {
          throw new Error('Did not resolve instance of Customer')
        }

        resCustomer = _customer

        if (resCustomer.account_balance > customer.account_balance) {
          type = 'debit'
          price = Math.max(0, resCustomer.account_balance - customer.account_balance)
        }
        else {
          type = 'credit'
          price = Math.max(0, customer.account_balance - resCustomer.account_balance)
        }

        return resCustomer.logAccountBalance(
          type,
          price,
          null,
          null,
          null,
          {transaction: options.transaction || null}
        )
      })
      .then(() => {
        return resCustomer.save({transaction: options.transaction || null})
      })
      .then(event => {
        return Customer.findByIdDefault(resCustomer.id, {transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param customer
   * @param cart
   * @returns {Promise}
   */
  addCart(customer, cart) {
    // const FootprintService = this.app.services.FootprintService
    const Customer = this.app.models.Customer
    const customerId = _.isObject(customer) ? customer.id : customer
    const cartId = _.isObject(cart) ? cart.id : cart

    if (!customerId || !cartId) {
      // TODO Create Proper Error
      const err = new Error(`Can not Associate ${customerId} with ${cartId} because it is invalid`)
      return Promise.reject(err)
    }
    let resCustomer
    return Customer.findById(customerId)
      .then(_customer => {
        if (!_customer) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCustomer = _customer
        return resCustomer.hasCart(cartId)
      })
      .then(hasCart => {
        if (!hasCart) {
          return resCustomer.addCart(cartId)
        }
        return
      })
      .then(() => {
        return resCustomer
      })
  }

  /**
   *
   * @param customer
   * @param cart
   * @returns {Promise.<TResult>}
   */
  removeCart(customer, cart) {
    //
    const Customer = this.app.models.Customer
    const customerId = _.isObject(customer) ? customer.id : customer
    const cartId = _.isObject(cart) ? cart.id : cart
    let resCustomer
    return Customer.findById(customerId)
      .then(_customer => {
        if (!_customer) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCustomer = _customer
        return resCustomer.hasCart(cartId)
      })
      .then(hasCart => {
        if (hasCart) {
          return resCustomer.removeCart(cartId)
        }
        return
      })
      .then(() => {
        return resCustomer
      })
  }

  /**
   *
   * @param customer
   * @param cart
   */
  setDefaultCartForCustomer(customer, cart) {
    const Customer = this.app.models.Customer
    const customerId = _.isObject(customer) ? customer.id : customer
    const cartId = _.isObject(cart) ? cart.id : cart

    if (!customerId || !cartId) {
      // TODO Create Proper Error
      const err = new Error(`Can not Associate ${customerId} with ${cartId} because it is invalid`)
      return Promise.reject(err)
    }
    return Customer.findById(customerId)
      .then(_customer => {
        return _customer.setDefault_cart(cartId)
      })
      .then(updatedCustomer => {
        return updatedCustomer
      })
  }

  /**
   *
   * @param customer
   * @param tag
   * @returns {Promise.<TResult>}
   */
  addTag(customer, tag) {
    const Customer = this.app.models['Customer']
    const Tag = this.app.models['Tag']
    let resCustomer, resTag
    return Customer.resolve(customer, {create: false})
      .then(_customer => {
        if (!_customer) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCustomer = _customer
        return Tag.resolve(tag)
      })
      .then(_tag => {
        if (!_tag) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resTag = _tag
        return resCustomer.hasTag(resTag.id)
      })
      .then(hasTag => {
        if (!hasTag) {
          return resCustomer.addTag(resTag.id)
        }
        return resCustomer
      })
      .then(_tag => {
        return Customer.findByIdDefault(resCustomer.id)
      })
  }

  /**
   *
   * @param customer
   * @param tag
   * @returns {Promise.<TResult>}
   */
  removeTag(customer, tag) {
    const Customer = this.app.models['Customer']
    const Tag = this.app.models['Tag']
    let resCustomer, resTag
    return Customer.resolve(customer, {create: false})
      .then(_customer => {
        if (!_customer) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCustomer = _customer
        return Tag.resolve(tag)
      })
      .then(_tag => {
        if (!_tag) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resTag = _tag
        return resCustomer.hasTag(resTag.id)
      })
      .then(hasTag => {
        if (hasTag) {
          return resCustomer.removeTag(resTag.id)
        }
        return resCustomer
      })
      .then(_tag => {
        return Customer.findByIdDefault(resCustomer.id)
      })
  }

  /**
   * Add Multiple collections
   * @param customer
   * @param collections
   * @param options
   * @returns {Promise.<*>}
   */
  addCollections(customer, collections, options) {
    options = options || {}
    if (!Array.isArray(collections)) {
      collections = [collections]
    }
    const Sequelize = this.app.models['Customer'].sequelize
    // const addedProducts = []
    // Setup Transaction
    return Sequelize.transaction(t => {
      return Sequelize.Promise.mapSeries(collections, collection => {
        return this.addCollection(customer, collection, {
          transaction: t
        })
      })
    })
  }

  /**
   *
   * @param customer
   * @param collection
   * @returns {Promise.<TResult>}
   */
  addCollection(customer, collection, options: {[key: string]: any} = {}) {
    const Customer = this.app.models['Customer']
    const Collection = this.app.models['Collection']
    let resCustomer, resCollection
    return Customer.resolve(customer, {create: false})
      .then(_customer => {
        if (!_customer) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCustomer = _customer
        return Collection.resolve(collection)
      })
      .then(_collection => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCollection = _collection
        return resCustomer.hasCollection(resCollection.id)
      })
      .then(hasCollection => {
        if (!hasCollection) {
          return resCustomer.addCollection(resCollection.id)
        }
        return resCustomer
      })
      .then(_collection => {
        return resCollection
      })
  }

  /**
   *
   * @param customer
   * @param collection
   * @returns {Promise.<TResult>}
   */
  removeCollection(customer, collection) {
    const Customer = this.app.models['Customer']
    const Collection = this.app.models['Collection']
    let resCustomer, resCollection
    return Customer.resolve(customer, {create: false})
      .then(_customer => {
        if (!_customer) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCustomer = _customer
        return Collection.resolve(collection)
      })
      .then(_collection => {
        if (!_collection) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCollection = _collection
        return resCustomer.hasCollection(resCollection.id)
      })
      .then(hasCollection => {
        if (hasCollection) {
          return resCustomer.removeCollection(resCollection.id)
        }
        return resCustomer
      })
      .then(_collection => {
        return resCollection
      })
  }

  /**
   *
   * @param customer
   * @param address
   * @param type
   * @param options
   * @returns {Promise.<TResult>}
   */
  addAddress(customer, address, type, options: {[key: string]: any} = {}) {
    const Customer = this.app.models['Customer']
    const Address = this.app.models['Address']

    let resCustomer
    return Customer.resolve(customer, {
      transaction: options.transaction || null,
      create: false
    })
      .then(_customer => {
        if (!_customer) {
          throw new Error('Unable to resolve Customer')
        }
        resCustomer = _customer

        if (type === 'shipping') {// || !resCustomer.shipping_address_id) {
          return resCustomer.updateShippingAddress(address, {transaction: options.transaction || null})
            .then(update => {
              return update.shipping_address
            })
        }
        return address
      })
      .then(shippingAddress => {
        if (type === 'billing') {// || !resCustomer.billing_address_id) {
          return resCustomer.updateBillingAddress(shippingAddress, {transaction: options.transaction || null})
            .then(update => {
              return update.billing_address
            })
        }
        return shippingAddress
      })
      .then(billingAddress => {
        if (type === 'default') {// || !resCustomer.default_address_id) {
          return resCustomer.updateDefaultAddress(billingAddress, {transaction: options.transaction || null})
            .then(update => {
              return update.default_address
            })
        }
        return billingAddress
      })
      .then(defaultAddress => {
        if (!type) {
          if (defaultAddress.id || defaultAddress.token) {
            return Address.resolve(defaultAddress, {transaction: options.transaction || null})
              .then(foundAddress => {
                return resCustomer.addAddress(foundAddress.id, {transaction: options.transaction || null})
                  .then(() => {
                    return foundAddress
                  })
              })
          }
          else {
            return resCustomer.createAddress(defaultAddress, {transaction: options.transaction || null})
          }
        }
        return defaultAddress
      })
      .then(resAddress => {
        return resAddress
      })
  }

  /**
   * Add Multiple Users
   * @param customer
   * @param users
   * @param options
   * @returns {Promise.<*>}
   */
  addUsers(customer, users, options: {[key: string]: any} = {}) {
    if (!Array.isArray(users)) {
      users = [users]
    }
    const Sequelize = this.app.models['Customer'].sequelize
    // const addedProducts = []
    // Setup Transaction
    return Sequelize.transaction(t => {
      return Sequelize.Promise.mapSeries(users, user => {
        return this.addUser(customer, user, {
          transaction: t
        })
      })
    })
  }

  /**
   *
   * @param customer
   * @param user
   * @param options
   * @returns {Promise.<TResult>}
   */
  addUser(customer, user, options: {[key: string]: any} = {}) {
    let resCustomer, resUser
    return this.app.models['Customer'].resolve(customer, {transaction: options.transaction || null})
      .then(_customer => {
        if (!_customer) {
          throw new Error('Customer Could Not Be Resolved')
        }
        resCustomer = _customer
        return this.app.models['User'].resolve(user, {transaction: options.transaction || null})
      })
      .then(_user => {
        if (!_user) {
          throw new Error('User Could Not Be Resolved')
        }
        resUser = _user
        return resCustomer.hasUser(resUser.id, {transaction: options.transaction || null})
      })
      .then(hasUser => {
        if (hasUser) {
          return
        }
        return resCustomer.addUser(resUser.id, {transaction: options.transaction || null})
      })
      .then(() => {
        return resUser
      })
  }


  inviteUser(customer, user, options) {
    options = options || {}
  }

  inviteUserAccepted(customer, user, options) {

  }

  /**
   *
   * @param customer
   * @param user
   * @param options
   * @returns {Promise.<TResult>}
   */
  removeUser(customer, user, options) {
    options = options || {}

    let resCustomer, resUser
    return this.app.models['Customer'].resolve(customer, {transaction: options.transaction || null})
      .then(_customer => {
        if (!_customer) {
          throw new Error('Customer Could Not Be Resolved')
        }
        resCustomer = _customer
        return this.app.models['User'].resolve(user, {transaction: options.transaction || null})
      })
      .then(_user => {
        if (!_user) {
          throw new Error('User Could Not Be Resolved')
        }
        resUser = _user
        return resCustomer.hasUser(resUser.id, {transaction: options.transaction || null})
      })
      .then(hasUser => {
        if (hasUser) {
          return
        }
        return resCustomer.removeUser(resUser.id, {transaction: options.transaction || null})
      })
      .then(() => {
        return resUser
      })
  }

  /**
   *
   * @param customer
   * @param address
   * @param type
   * @param options
   * @returns {Promise.<TResult>}
   */
  updateAddress(customer, address, type, options) {
    options = options || {}
    const Customer = this.app.models['Customer']
    const Address = this.app.models['Address']

    // address = Address.cleanAddress(address)

    let resCustomer
    return Customer.resolve(customer, {transaction: options.transaction || null, create: false})
      .then(_customer => {
        if (!_customer) {
          throw new Error('Unable to resolve Customer')
        }
        resCustomer = _customer

        return Address.resolve(address, {transaction: options.transaction || null})
      })
      .then(foundAddress => {
        if (!foundAddress) {
          throw new Error('Address could not resolve')
        }
        return foundAddress.merge(address).save({transaction: options.transaction || null})
      })
      .then(updatedAddress => {
        if (type === 'shipping') {// || !resCustomer.shipping_address_id) {
          return resCustomer.updateShippingAddress(updatedAddress, {transaction: options.transaction || null})
            .then(update => {
              return update.shipping_address
            })
        }
        return updatedAddress
      })
      .then(shippingAddress => {
        if (type === 'billing') {// || !resCustomer.billing_address_id) {
          return resCustomer.updateBillingAddress(shippingAddress, {transaction: options.transaction || null})
            .then(update => {
              return update.billing_address
            })
        }
        return shippingAddress
      })
      .then(billingAddress => {
        if (type === 'default') {// || !resCustomer.default_address_id) {
          return resCustomer.updateDefaultAddress(billingAddress, {transaction: options.transaction || null})
            .then(update => {
              return update.default_address
            })
        }
        return billingAddress
      })
      .then(defaultAddress => {
        if (!type) {
          if (defaultAddress.id || defaultAddress.token) {
            return Address.resolve(defaultAddress, {transaction: options.transaction || null})
              .then(foundAddress => {
                return resCustomer.addAddress(foundAddress.id, {transaction: options.transaction || null})
                  .then(() => {
                    return foundAddress
                  })
              })
          }
          else {
            return resCustomer.createAddress(defaultAddress, {transaction: options.transaction || null})
          }
        }
        return defaultAddress
      })
      .then(resAddress => {
        return resAddress
      })
  }

  /**
   *
   * @param customer
   * @param address
   * @param options
   * @returns {*}
   */
  removeAddress(customer, address, options) {
    options = options || {}
    const Customer = this.app.models['Customer']
    const Address = this.app.models['Address']
    let resCustomer, resAddress
    return Customer.resolve(customer, {transaction: options.transaction || null, create: false})
      .then(foundCustomer => {
        if (!foundCustomer) {
          throw new Error('Customer could not resolve')
        }
        resCustomer = foundCustomer
        return Address.resolve(address, {transaction: options.transaction || null})
      })
      .then(foundAddress => {
        if (!foundAddress) {
          throw new Error('Address could not resolve')
        }
        resAddress = foundAddress
        return resCustomer.removeAddress(resAddress.id, {transaction: options.transaction || null})
      })
      .then(destroyedAddress => {
        return resAddress
      })
  }

  /**
   *
   * @param customer
   * @param options
   * @returns {Promise.<TResult>}
   */
  setAddresses(customer, options) {
    options = options || {}
    const Customer = this.app.models['Customer']
    let resCustomer
    return Customer.resolve(customer, {transaction: options.transaction || null, create: false})
      .then(_customer => {
        resCustomer = _customer
        if (resCustomer.shipping_address_id && resCustomer.changed('shipping_address_id')) {
          return resCustomer.hasAddress(resCustomer.shipping_address_id, {
            // through: {
            address: 'shipping',
            // },
            transaction: options.transaction || null
          })
        }
        return false
      })
      .then(hasShipping => {
        if (!hasShipping && resCustomer.shipping_address_id && resCustomer.changed('shipping_address_id')) {
          return resCustomer.addAddress(resCustomer.shipping_address_id, {
            // through: {
            address: 'shipping',
            // },
            transaction: options.transaction || null
          })
        }
        return
      })
      .then(() => {
        if (resCustomer.billing_address_id && resCustomer.changed('billing_address_id')) {
          return resCustomer.hasAddress(resCustomer.billing_address_id, {
            // through: {
            address: 'billing',
            // },
            transaction: options.transaction || null
          })
        }
        return false
      })
      .then(hasBilling => {
        if (!hasBilling && resCustomer.billing_address_id && resCustomer.changed('billing_address_id')) {
          return resCustomer.addAddress(resCustomer.billing_address_id, {
            // through: {
            address: 'billing',
            // },
            transaction: options.transaction || null
          })
        }
        return
      })
      .then(() => {
        if (resCustomer.default_address_id && resCustomer.changed('default_address_id')) {
          return resCustomer.hasAddress(resCustomer.default_address_id, {
            // through: {
            address: 'default',
            // },
            transaction: options.transaction || null
          })
        }
        return false
      })
      .then(hasDefault => {
        if (!hasDefault && resCustomer.default_address_id && resCustomer.changed('default_address_id')) {
          return resCustomer.addAddress(resCustomer.default_address_id, {
            // through: {
            address: 'default',
            // },
            transaction: options.transaction || null
          })
        }
        return
      })
      .then(() => {
        return resCustomer
      })
  }
  /**
   *
   * @param customer
   * @param options
   * @returns {Promise.<TResult>}
   */
  afterCreate(customer, options) {
    options = options || {}
    return this.setAddresses(customer, options)
      .then(customerAddresses => {
        this.app.services.EngineService.publish('customer.created', customer)
        return customer
      })
  }

  /**
   *
   * @param customer
   * @param options
   * @returns {Promise.<TResult>}
   */
  afterUpdate(customer, options) {
    options = options || {}
    this.app.services.EngineService.publish('customer.updated', customer)
    let updateAccounts = false
    let updateAddresses = false
    const accountUpdates: {[key: string]: any} = {}

    if (customer.changed('email')) {
      updateAccounts = true
      accountUpdates.email = customer.email
    }
    if (customer.changed('shipping_address_id') || customer.changed('billing_address_id') || customer.changed('default_address_id')) {
      updateAddresses = true
    }

    return Promise.resolve()
      .then(() => {
        if (updateAddresses) {
          return this.setAddresses(customer, options)
        }
        return
      })
      .then(() => {
        if (updateAccounts) {
          return this.app.models['Account'].findAll({
            where: {
              customer_id: customer.id
            }
          })
            .then(accounts => {
              return Promise.all(accounts.map(account => {
                return this.app.services.AccountService.update(account, accountUpdates)
              }))
            })
            .then(updatedAccounts => {
              return customer
            })
        }
        return
      })
      .then(() => {
        return customer
      })
  }

  /**
   *
   * @param customer
   * @param source
   * @returns {*|Promise.<TResult>}
   */
  createCustomerSource(customer, source, options = {}) {
    const Account = this.app.models['Account']
    return Account.findOne({
      where: {
        customer_id: customer.id,
        gateway: source.gateway
      }
    })
      .then(account => {
        if (!account) {
          throw new Error('Account not found')
        }
        // source.account_id = account.id
        return this.app.services.AccountService.addSource(account, source.gateway_token, options)
      })
  }

  /**
   *
   * @param customer
   * @param source
   * @returns {Promise.<TResult>}
   */
  findCustomerSource(customer, source, options = {}) {
    const Account = this.app.models['Account']
    return Account.findOne({
      where: {
        customer_id: customer.id,
        gateway: source.gateway
      }
    })
      .then(account => {
        source.account_id = account.id
        return this.app.services.AccountService.findSource(account, source, options)
      })
  }

  /**
   *
   * @param customer
   * @param account
   * @returns {Promise.<TResult>}
   */
  syncCustomerSources(customer, account, options = {}) {
    const Account = this.app.models['Account']
    return Account.findOne({
      where: {
        customer_id: customer.id,
        gateway: account.gateway
      }
    })
      .then(_account => {
        return this.app.services.AccountService.syncSources(_account, options)
      })
  }
  /**
   *
   * @param customer
   * @param source
   * @param updates
   * @returns {*|Promise.<TResult>}
   */
  updateCustomerSource(customer, source, updates) {
    const Account = this.app.models['Account']
    return Account.findOne({
      where: {
        customer_id: customer.id,
        gateway: source.gateway
      }
    })
      .then(account => {
        source.account_id = account.id
        return this.app.services.AccountService.updateSource(account, source, updates)
      })
  }

  /**
   *
   * @param customer
   * @param options
   * @returns {Promise}
   */
  enable(customer, options) {
    options = options || {}
    const Customer = this.app.models['Customer']

    let resCustomer
    return Customer.resolve(customer, options)
      .then(_customer => {
        if (!_customer) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCustomer = _customer
        return resCustomer.update({state: CUSTOMER_STATE.ENABLED})
      })
      .then(() => {
        // return resCustomer.reload()
        const event = {
          object_id: resCustomer.id,
          object: 'customer',
          objects: [{
            customer: resCustomer.id
          }],
          type: 'customer.enabled',
          message: `Customer ${ resCustomer.email || 'ID ' + resCustomer.id } enabled`,
          data: resCustomer
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        return resCustomer
      })
  }

  /**
   *
   * @param customer
   * @param options
   * @returns {Promise}
   */
  disable(customer, options) {
    options = options || {}
    const Customer = this.app.models['Customer']

    let resCustomer
    return Customer.resolve(customer, options)
      .then(_customer => {
        if (!_customer) {
          throw new ModelError('E_NOT_FOUND', 'Customer not found')
        }
        resCustomer = _customer
        return resCustomer.update({state: CUSTOMER_STATE.DISABLED})
      })
      .then(_customer => {
        // return resCustomer.reload()
        const event = {
          object_id: resCustomer.id,
          object: 'customer',
          objects: [{
            customer: resCustomer.id
          }],
          type: 'customer.disabled',
          message: `Customer ${ resCustomer.email || 'ID ' + resCustomer.id } disabled`,
          data: resCustomer
        }
        return this.app.services.EngineService.publish(event.type, event, {
          save: true,
          transaction: options.transaction || null
        })
      })
      .then(event => {
        return resCustomer
      })
  }

  /**
   *
   * @param customer
   * @param source
   * @returns {*|Promise.<TResult>}
   */
  removeCustomerSource(customer, source, options = {}) {
    const Source = this.app.models['Source']
    return Source.resolve(source)
      .then(_source => {
        return this.app.services.AccountService.removeSource(_source, options)
      })
  }
}

