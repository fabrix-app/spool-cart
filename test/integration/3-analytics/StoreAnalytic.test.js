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
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get New Customers', (done) => {
    global.app.analytics.StoreAnalytic.newCustomers()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get New Subscriptions', (done) => {
    global.app.analytics.StoreAnalytic.newSubscriptions()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get Active Subscriptions', (done) => {
    global.app.analytics.StoreAnalytic.activeSubscriptions()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should get Reactivated Subscriptions', (done) => {
    global.app.analytics.StoreAnalytic.reactivatedSubscriptions()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
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
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('should get Failed Charges', (done) => {
    global.app.analytics.StoreAnalytic.failedCharges()
      .then(analytics => {
        console.log('BROKE ANALYTICS', analytics[0].data, analytics[0].labels)
        assert.equal(analytics.length, 1)
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
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
