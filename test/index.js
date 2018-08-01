'use strict'

const FabrixApp = require('@fabrix/fabrix').FabrixApp

before(function(done) {
  this.timeout(150000)

  global.app = new FabrixApp(require('./fixtures/app'))
  // return global.app.start().catch(global.app.stop)
  global.app.start()
    .then(() => {
      console.log('BROKE, MADE IT HERE')
      return global.app.models.Shop.findAll()
    })
    .then(shops => {
      global.shopID = shops[0].id
      let products = require('./fixtures/products')
      products = products.map( product => {
        product.shops = [{id: global.shopID}]
        return product
      })
      return global.app.services.ProductService.addProducts(products)
    })
    .then(products => {
      // console.log('BEFORE ALL', products)
      products = products.map(product => {
        // console.log('BEFORE ALL',product)
        return product.get({plain: true})
      })
      global.shopProducts = products
      done()
    })
    .catch(err => {
      console.log(err)
      global.app.stop(err)
      done(err)
    })
})

after(() => {
  return global.app.stop()
})
