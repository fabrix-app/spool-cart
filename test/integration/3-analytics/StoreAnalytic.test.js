'use strict'
/* global describe, it */

const assert = require('assert')

describe('StoreAnalytic', () => {
  it('should exist', () => {
    assert(global.app.api.analytics['StoreAnalytic'])
    assert(global.app.analytics['StoreAnalytic'])
  })

  it('should get Active Customers', (done) => {
    global.app.analytics.StoreAnalytic.activeCustomers()
      .then(analytics => {
        // // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.activeCustomers')
        assert.equal(analytics[1][0].name, 'store.1.activeCustomers')
        assert.equal(analytics[2][0].name, 'store.2.activeCustomers')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get New Customers', (done) => {
    global.app.analytics.StoreAnalytic.newCustomers()
      .then(analytics => {
        // // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.newCustomers')
        assert.equal(analytics[1][0].name, 'store.1.newCustomers')
        assert.equal(analytics[2][0].name, 'store.2.newCustomers')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get New Subscriptions', (done) => {
    global.app.analytics.StoreAnalytic.newSubscriptions()
      .then(analytics => {
        // // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.newSubscriptions')
        assert.equal(analytics[1][0].name, 'store.1.newSubscriptions')
        assert.equal(analytics[2][0].name, 'store.2.newSubscriptions')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get Active Subscriptions', (done) => {
    global.app.analytics.StoreAnalytic.activeSubscriptions()
      .then(analytics => {
        // // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.activeSubscriptions')
        assert.equal(analytics[1][0].name, 'store.1.activeSubscriptions')
        assert.equal(analytics[2][0].name, 'store.2.activeSubscriptions')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it.skip('should get Reactivated Subscriptions', (done) => {
    global.app.analytics.StoreAnalytic.reactivatedSubscriptions()
      .then(analytics => {
        // // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.reactivatedSubscriptions')
        assert.equal(analytics[1][0].name, 'store.1.reactivatedSubscriptions')
        assert.equal(analytics[2][0].name, 'store.2.reactivatedSubscriptions')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get Cancelled  Subscriptions', (done) => {
    global.app.analytics.StoreAnalytic.cancelledSubscriptions()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.cancelledSubscriptions')
        assert.equal(analytics[1][0].name, 'store.1.cancelledSubscriptions')
        assert.equal(analytics[2][0].name, 'store.2.cancelledSubscriptions')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get Subscriptions Total Discounts Redeemed', (done) => {
    global.app.analytics.StoreAnalytic.subscriptionDiscountsRedeemed()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.subscriptionDiscountsRedeemed')
        assert.equal(analytics[1][0].name, 'store.1.subscriptionDiscountsRedeemed')
        assert.equal(analytics[2][0].name, 'store.2.subscriptionDiscountsRedeemed')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get Total Discounts Redeemed', (done) => {
    global.app.analytics.StoreAnalytic.discountsRedeemed()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.discountsRedeemed')
        assert.equal(analytics[1][0].name, 'store.1.discountsRedeemed')
        assert.equal(analytics[2][0].name, 'store.2.discountsRedeemed')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get MMR', (done) => {
    global.app.analytics.StoreAnalytic.MMR()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.MMR')
        assert.equal(analytics[1][0].name, 'store.1.MMR')
        assert.equal(analytics[2][0].name, 'store.2.MMR')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get ARR', (done) => {
    global.app.analytics.StoreAnalytic.ARR()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.ARR')
        assert.equal(analytics[1][0].name, 'store.1.ARR')
        assert.equal(analytics[2][0].name, 'store.2.ARR')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get ARPC', (done) => {
    global.app.analytics.StoreAnalytic.ARPC()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.ARPC')
        assert.equal(analytics[1][0].name, 'store.1.ARPC')
        assert.equal(analytics[2][0].name, 'store.2.ARPC')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get Net Revenue', (done) => {
    global.app.analytics.StoreAnalytic.NR()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.NR')
        assert.equal(analytics[1][0].name, 'store.1.NR')
        assert.equal(analytics[2][0].name, 'store.2.NR')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get churn', (done) => {
    global.app.analytics.StoreAnalytic.churn()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.churn')
        assert.equal(analytics[1][0].name, 'store.1.churn')
        assert.equal(analytics[2][0].name, 'store.2.churn')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get MMRChurn', (done) => {
    global.app.analytics.StoreAnalytic.MMRChurn()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.MMRChurn')
        assert.equal(analytics[1][0].name, 'store.1.MMRChurn')
        assert.equal(analytics[2][0].name, 'store.2.MMRChurn')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get RLTV', (done) => {
    global.app.analytics.StoreAnalytic.RLTV()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.RLTV')
        assert.equal(analytics[1][0].name, 'store.1.RLTV')
        assert.equal(analytics[2][0].name, 'store.2.RLTV')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get LTV', (done) => {
    global.app.analytics.StoreAnalytic.LTV()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.LTV')
        assert.equal(analytics[1][0].name, 'store.1.LTV')
        assert.equal(analytics[2][0].name, 'store.2.LTV')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get ARPC', (done) => {
    global.app.analytics.StoreAnalytic.ARPC()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.ARPC')
        assert.equal(analytics[1][0].name, 'store.1.ARPC')
        assert.equal(analytics[2][0].name, 'store.2.ARPC')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get failedCharges', (done) => {
    global.app.analytics.StoreAnalytic.failedCharges()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.failedCharges')
        assert.equal(analytics[1][0].name, 'store.1.failedCharges')
        assert.equal(analytics[2][0].name, 'store.2.failedCharges')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get cancelledCharges', (done) => {
    global.app.analytics.StoreAnalytic.cancelledCharges()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.cancelledCharges')
        assert.equal(analytics[1][0].name, 'store.1.cancelledCharges')
        assert.equal(analytics[2][0].name, 'store.2.cancelledCharges')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('should get abandonedCarts', (done) => {
    global.app.analytics.StoreAnalytic.abandonedCarts()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.abandonedCarts')
        assert.equal(analytics[1][0].name, 'store.1.abandonedCarts')
        assert.equal(analytics[2][0].name, 'store.2.abandonedCarts')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('should get repeatCustomers', (done) => {
    global.app.analytics.StoreAnalytic.repeatCustomers()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0][0].data, analytics[0][0].labels)
        assert.equal(analytics.length, 3)
        assert.equal(analytics[0][0].name, 'store.repeatCustomers')
        assert.equal(analytics[1][0].name, 'store.1.repeatCustomers')
        assert.equal(analytics[2][0].name, 'store.2.repeatCustomers')
        done()
      })
      .catch(err => {
        console.log('BROKE ERR', err)
        done(err)
      })
  })
})
