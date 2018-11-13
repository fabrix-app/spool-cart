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
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.activeCustomers')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get New Customers', (done) => {
    global.app.analytics.StoreAnalytic.newCustomers()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.newCustomers')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get New Subscriptions', (done) => {
    global.app.analytics.StoreAnalytic.newSubscriptions()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.newSubscriptions')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get Active Subscriptions', (done) => {
    global.app.analytics.StoreAnalytic.activeSubscriptions()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.activeSubscriptions')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it.skip('should get Reactivated Subscriptions', (done) => {
    global.app.analytics.StoreAnalytic.reactivatedSubscriptions()
      .then(analytics => {
        // console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.reactivatedSubscriptions')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get Cancelled  Subscriptions', (done) => {
    global.app.analytics.StoreAnalytic.cancelledSubscriptions()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.cancelledSubscriptions')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get Subscriptions Total Discounts Redeemed', (done) => {
    global.app.analytics.StoreAnalytic.subscriptionDiscountsRedeemed()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.subscriptionDiscountsRedeemed')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get Total Discounts Redeemed', (done) => {
    global.app.analytics.StoreAnalytic.discountsRedeemed()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.discountsRedeemed')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get MMR', (done) => {
    global.app.analytics.StoreAnalytic.MMR()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.MMR')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get ARR', (done) => {
    global.app.analytics.StoreAnalytic.ARR()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.ARR')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get ARPC', (done) => {
    global.app.analytics.StoreAnalytic.ARPC()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.ARPC')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get Net Revenue', (done) => {
    global.app.analytics.StoreAnalytic.NR()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.NR')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get churn', (done) => {
    global.app.analytics.StoreAnalytic.churn()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.churn')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get MMRChurn', (done) => {
    global.app.analytics.StoreAnalytic.MMRChurn()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.MMRChurn')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get RLTV', (done) => {
    global.app.analytics.StoreAnalytic.RLTV()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.RLTV')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get LTV', (done) => {
    global.app.analytics.StoreAnalytic.LTV()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.LTV')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get ARPC', (done) => {
    global.app.analytics.StoreAnalytic.ARPC()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.ARPC')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get failedCharges', (done) => {
    global.app.analytics.StoreAnalytic.failedCharges()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.failedCharges')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get cancelledCharges', (done) => {
    global.app.analytics.StoreAnalytic.cancelledCharges()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.cancelledCharges')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('should get abandonedCarts', (done) => {
    global.app.analytics.StoreAnalytic.abandonedCarts()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.abandonedCarts')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('should get repeatCustomers', (done) => {
    global.app.analytics.StoreAnalytic.repeatCustomers()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        assert.equal(analytics[0].name, 'store.repeatCustomers')
        done()
      })
      .catch(err => {
        console.log('BROKE ERR', err)
        done(err)
      })
  })
})
