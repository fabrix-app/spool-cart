// tslint:disable:max-line-length
import { Analytic } from '@fabrix/spool-analytics'
import * as moment from 'moment'

// Analytics Model Reference
// start: {
//   type: Sequelize.DATE
// },
// end: {
//   type: Sequelize.DATE
// },
// name: {
//   type: Sequelize.STRING
// },
// group_label: {
//   type: Sequelize.STRING
// },
// labels: {
//   type: Sequelize.JSONB,
//     defaultValue: []
// },
// data: {
//   type: Sequelize.JSONB,
//     defaultValue: []
// },


export class StoreAnalytic extends Analytic {
  run() {
    console.log('StoreAnalytic: I AM AUTOMATICALLY RUNNING...', !!this.app)
  }


  /**
   * Monthly Recurring Revenue (MMR):
   * It is calculated by adding up the value of all of your active subscription customers, minus any discounts.
   *
   * Formula: Active Subscriptions Dollar Amount - Discounts
   */
  MMR(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')
    return this.app.models.Subscription.findAll({
      where: {
        renews_on: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        active: true
      },
      attributes: [
        [this.app.models.Subscription.sequelize.literal('SUM(total_due)'), 'total'],
        [this.app.models.Subscription.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        let data = count.map(c => {
          return [parseInt(c.get('count'), 10), parseInt(c.get('total'), 10), c.currency]
        })

        if (data.length === 0) {
          data = [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.MMR',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['total', 'gross', 'currency'],
          data: data
        }])
      })
  }

  /**
   * Net Revenue (NR):
   * You can see how much money flowed into your business each day, minus any discount.
   * Formula: Gross Volume (Recurring and Non-recurring) - Refunds = Net Revenue
   */
  NR(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    let resSales
    return this.app.models.Transaction.findAll({
      where: {
        created_at: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        status: 'success',
        $or: [
          {
            kind: 'sale'
          },
          {
            kind: 'capture'
          }
        ]
      },
      attributes: [
        [this.app.models.Transaction.sequelize.literal('SUM(amount)'), 'total'],
        [this.app.models.Transaction.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        resSales = count

        return this.app.models.Transaction.findAll({
          where: {
            created_at: {
              $gte: start.format('YYYY-MM-DD HH:mm:ss')
            },
            status: 'success',
            kind: 'refund'
          },
          attributes: [
            [this.app.models.Transaction.sequelize.literal('SUM(amount)'), 'total'],
            [this.app.models.Transaction.sequelize.literal('COUNT(id)'), 'count'],
            'currency'
          ],
          group: ['currency']
        })
      })
      .then(count => {
        let data = count.map((c, index) => {
          const ct = resSales[index].get('count') - (c.get('count') || 0)
          const total = resSales[index].get('total') - (c.get('total') || 0)
          return [ct, total, c.currency]
        })

        if (data.length === 0) {
          data = [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.NR',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['total', 'gross', 'currency'],
          data: data
        }])
      })
  }

  /**
   * Fees: How much you are gathering in fees by credit card processing.
   * Formula: Gross Processing Fees
   */
  // TODO
  fees(options: {[key: string]: any} = {}) {

  }

  /**
   * Average Recurring Revenue Per Customer (ARPC):
   * is a simple but powerful metric: the average value of each of your customers.
   * Compare your ARPC to the cost of supporting each customer and you can quickly see if your business is viable in the long term.
   * A $100/mo. Customer is always better than a $10/mo. one, and conversely, the higher your ARPC, the better.
   * Formula: Monthly Recurring Revenue ÷ Active Customers = ARPC
   */
  ARPC(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    let resCustomers
    return this.app.models.Customer.findAll({
      where: {
        updated_at: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        total_spent: {
          $gte: 1
        }
      },
      attributes: [
        [this.app.models.Customer.sequelize.literal('SUM(total_spent)'), 'total'],
        [this.app.models.Customer.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        resCustomers = count

        return this.app.models.Subscription.findAll({
          where: {
            renews_on: {
              $gte: start.format('YYYY-MM-DD HH:mm:ss')
            }
          },
          attributes: [
            [this.app.models.Subscription.sequelize.literal('SUM(total_price)'), 'total'],
            [this.app.models.Subscription.sequelize.literal('COUNT(id)'), 'count'],
            'currency'
          ],
          group: ['currency']
        })
      })
      .then(count => {
        let data = count.map((c, i) => {
          const amount = c.get('total') / resCustomers[i].get('count')
          return [amount, c.currency]
        })

        if (data.length === 0) {
          data = [[0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.ARPU',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['gross', 'currency'],
          data: data
        }])
      })
  }

  /**
   * Annual Run Rate (ARR):
   * ARR is the current value of your business projected out over the next year. When you hear someone refer to a $10M business, they’re generally referring to ARR.
   * Formula: Monthly Recurring Revenue x 12 = ARR
   */
  ARR(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')
    return this.app.models.Subscription.findAll({
      where: {
        renews_on: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        active: true
      },
      attributes: [
        [this.app.models.Subscription.sequelize.literal('SUM(total_due)'), 'total'],
        [this.app.models.Subscription.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        let data = count.map(c => {
          return [parseInt(c.get('count'), 10) * 12, parseInt(c.get('total'), 10) * 12, c.currency]
        })

        if (data.length === 0) {
          data = [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.ARR',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['total', 'gross', 'currency'],
          data: data
        }])
      })
  }

  /**
   * Lifetime Value (LTV):
   * Lifetime value is a educated guess at how much you can expect to make from the average customer before they churn.
   * Knowing your LTV will help you decide how much you can spend to acquire and support each new customer.
   * The higher, the better.
   * Formula: Average Monthly Recurring Revenue Per Customer ÷ Customer Churn Rate = LTV
   */
  LTV(options: {[key: string]: any} = {}) {

    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    let resMMR
    return this.app.models.Subscription.findAll({
      where: {
        renews_on: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        active: true
      },
      attributes: [
        [this.app.models.Subscription.sequelize.literal('SUM(total_due)'), 'total'],
        [this.app.models.Subscription.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        resMMR = count

        return this.app.models.Analytic.findOne({
          where: {
            name: 'store.churn'
          }
        })
      })
      .then(prevChurn => {
        prevChurn = prevChurn || {
          data: [[1, this.app.config.get('cart.default_currency')]]
        }

        let data = resMMR.map((c, index) => {
          const ltv = c.get('total') / (prevChurn.data[index][0] || 1)
          // return [parseInt(c.get('count'), 10), parseInt(c.get('total'), 10), c.currency]
          return [ltv, c.currency]
        })

        if (data.length === 0) {
          data = [[0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.LTV',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['ltv', 'currency'],
          data: data
        }])
      })

  }

  /**
   * Customer Chrun (Churn):
   * Customer churn is the percentage of customers who left in the previous 30 day period relative to your total customer subscription count 30 days ago.
   * A high churn rate can spell the end of your business. Though it varies from business to business, generally you want to aim for a churn rate in the low single digits.
   * Formula: (Cancelled Subscriptions in the last 30 days ÷ Active Subscriptions 30 days ago) x 100
   */
  churn(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const start2 = moment()
      .subtract(2, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    let resCancelled
    return this.app.models.Subscription.count({
      where: {
        cancelled_at: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        cancelled: true
      },
      attributes: [
        [this.app.models.Subscription.sequelize.literal('SUM(total_price)'), 'total'],
        [this.app.models.Subscription.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        resCancelled = count

        return this.app.models.Analytic.findOne({
          where: {
            name: 'store.activeSubscriptions',
            end: {
              $gte: start2.format('YYYY-MM-DD HH:mm:ss')
            }
          }
        })
      })
      .then(prevChurn => {
        prevChurn = prevChurn || {
          data: [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        let data = resCancelled.map((c, index) => {
          prevChurn.data[index] = prevChurn.data[index] || [0, 0, c.currency]
          const total = (resCancelled.get('total') / prevChurn.data[index].total) * 100
          return [total, c.currency]
        })

        if (data.length === 0) {
          data = [[0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.churn',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['churn', 'currency'],
          data: data
        }])
      })
  }

  /**
   * Monthly Recurring Revenue Churn:
   * Revenue churn is the percentage of MRR that has been lost in the last 30 days relative to your total MRR 30 days ago.
   * Churn of any kind is bad, but a high revenue churn rate means that high value customers are leaving at a higher clip than others.
   * You need to watch revenue churn like a hawk!
   * Formula: (MRR Lost to Downgrades & Cancellations in the last 30 days ÷ MRR 30 days ago) x 100
   */
  MMRChurn(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const start2 = moment()
      .subtract(2, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    let resCancelled
    return this.app.models.Subscription.count({
      where: {
        cancelled_at: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        cancelled: true
      },
      attributes: [
        [this.app.models.Subscription.sequelize.literal('SUM(total_price)'), 'total'],
        [this.app.models.Subscription.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        resCancelled = count

        return this.app.models.Analytic.findOne({
          where: {
            name: 'store.MMR',
            end: {
              $gte: start2.format('YYYY-MM-DD HH:mm:ss')
            }
          }
        })
      })
      .then(prevMMR => {
        prevMMR = prevMMR || {
          data: [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        let data = resCancelled.map((c, index) => {
          prevMMR.data[index] = prevMMR.data[index] || [0, 0, c.currency]
          const total = (resCancelled.get('total') / prevMMR.data[index].total) * 100
          return [total, c.currency]
        })

        if (data.length === 0) {
          data = [[0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.churn',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['churn', 'currency'],
          data: data
        }])
      })
  }

  /**
   * Quick Ratio (QR):
   * The Quick Ratio of a SaaS company is the measurement of its growth efficiency.
   * How reliably can your company grow revenue given its current churn rate?
   * To calculate your Quick Ratio you simply divide new MRR by lost MRR. The higher the ratio, the healthier the growth is at the company.
   * Formula: Quick Ratio = (New MRR + Expansion MRR) / (Contraction MRR + Churned MRR)
   */
  QR(options: {[key: string]: any} = {}) {

  }

  /**
   * Active Customers:
   * Customers are your favorite people.
   * They pay you money, and money is great!
   * Not included in your customer count are folks on a free plan or free trial, have a 100% coupon, delinquent, or have paid you for a one off purchase but not a subscription.
   * Formula: Gross Active Customers in the last 30 days
   */
  activeCustomers(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    return this.app.models.Customer.findAll({
      where: {
        updated_at: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        total_spent: {
          $gte: 1
        }
      },
      attributes: [
        [this.app.models.Customer.sequelize.literal('SUM(total_spent)'), 'total'],
        [this.app.models.Customer.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        let data = count.map(c => {
          return [parseInt(c.get('count'), 10), parseInt(c.get('total'), 10), c.currency]
        })

        if (data.length === 0) {
          data = [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.activeCustomers',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['total', 'gross', 'currency'],
          data: data
        }])
      })
  }

  /**
   * New Customers:
   * The number of new customer sign ups per month.
   * Formula: New Customers in the last 30 days
   */
  newCustomers(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    return this.app.models.Customer.findAll({
      where: {
        created_at: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        }
      },
      attributes: [
        [this.app.models.Customer.sequelize.literal('SUM(total_spent)'), 'total'],
        [this.app.models.Customer.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        let data = count.map(c => {
          return [parseInt(c.get('count'), 10), parseInt(c.get('total'), 10), c.currency]
        })

        if (data.length === 0) {
          data = [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.newCustomers',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['total', 'gross', 'currency'],
          data: data
        }])
      })
  }

  /**
   * Reactivated Subscriptions:
   * The number of customers who canceled and then signed back up.
   * Formula: New Active Subscribers in the last 30 days ÷ Active Subscribers 30 days ago)
   */
  // TODO
  reactivatedSubscriptions(options: {[key: string]: any} = {}) {
    const start1 = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const start2 = moment()
      .subtract(2, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    return this.app.models.Subscription.findAll({
      where: {
        renews_on: {
          $gte: start1.format('YYYY-MM-DD HH:mm:ss')
        },
        active: true
      },
      attributes: [
        [this.app.models.Subscription.sequelize.literal('SUM(total_price)'), 'total'],
        [this.app.models.Subscription.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        let data = count.map(c => {
          return [parseInt(c.get('count'), 10), parseInt(c.get('total'), 10), c.currency]
        })

        if (data.length === 0) {
          data = [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.reactivatedSubscriptions',
          start: start1.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['total', 'gross', 'currency'],
          data: data
        }])
      })
  }

  /**
   * New Subscriptions:
   * The number of new customer subscriptions signups per month.
   * Formula: New Active Subscription Customers in the last 30 days
   */
  newSubscriptions(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    return this.app.models.Subscription.findAll({
      where: {
        created_at: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        }
      },
      attributes: [
        [this.app.models.Subscription.sequelize.literal('SUM(total_price)'), 'total'],
        [this.app.models.Subscription.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        let data = count.map(c => {
          return [parseInt(c.get('count'), 10), parseInt(c.get('total'), 10), c.currency]
        })

        if (data.length === 0) {
          data = [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.newSubscriptions',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['total', 'gross', 'currency'],
          data: data
        }])
      })
  }

  /**
   * Active Subscriptions:
   * The number of active subscriptions per month.
   * Formula: Active Subscription Customers
   */
  activeSubscriptions(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')
    return this.app.models.Subscription.findAll({
      where: {
        renews_on: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        active: true
      },
      attributes: [
        [this.app.models.Subscription.sequelize.literal('SUM(total_price)'), 'total'],
        [this.app.models.Subscription.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        let data = count.map(c => {
          return [parseInt(c.get('count'), 10), parseInt(c.get('total'), 10), c.currency]
        })

        if (data.length === 0) {
          data = [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.activeSubscriptions',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['total', 'gross', 'currency'],
          data: data
        }])
      })
  }

  /**
   * Cancelled Subscriptions:
   * The number of cancelled subscriptions per month.
   * Formula: Cancelled Subscription Customers in the last 30 days
   */
  cancelledSubscriptions(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    return this.app.models.Subscription.count({
      where: {
        cancelled_at: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        cancelled: true
      },
      attributes: [
        [this.app.models.Subscription.sequelize.literal('SUM(total_price)'), 'total'],
        [this.app.models.Subscription.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        let data = count.map(c => {
          return [parseInt(c.get('count'), 10), parseInt(c.get('total'), 10), c.currency]
        })

        if (data.length === 0) {
          data = [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.cancelledSubscriptions',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['total', 'gross', 'currency'],
          data: data
        }])
      })
  }

  /**
   * Upgraded Subscriptions:
   * The number of upgraded subscriptions
   * Formula: Active Subscribers / New Subscriptions in the last 30 days ?
   */
  // TODO
  upgradedSubscriptions(options: {[key: string]: any} = {}) {

  }

  /**
   * Subscription Discounts Redeemed:
   * The number of discounts used
   * Formula: Monthly Recurring Revenue - Discounts = Discounts Redeemed
   */
  subscriptionDiscountsRedeemed(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    return this.app.models.Subscription.count({
      where: {
        renews_on: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        }
      },
      attributes: [
        [this.app.models.Subscription.sequelize.literal('SUM(total_price)'), 'total'],
        [this.app.models.Subscription.sequelize.literal('SUM(total_discounts)'), 'total_discounts'],
        [this.app.models.Subscription.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        let data = count.map(c => {
          const total = parseInt(c.total_discounts, 10)
          return [parseInt(c.count, 10), total, c.currency]
        })

        if (data.length === 0) {
          data = [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.subscriptionDiscountsRedeemed',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['total', 'gross', 'currency'],
          data: data
        }])
      })
  }

  /**
   * Discounts Redeemed:
   * The number of discounts used
   * Formula: Revenue - Discounts = Discounts Redeemed
   */
  discountsRedeemed(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    return this.app.models.Order.count({
      where: {
        created_at: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        financial_status: 'paid'
      },
      attributes: [
        [this.app.models.Order.sequelize.literal('SUM(total_price)'), 'total'],
        [this.app.models.Order.sequelize.literal('SUM(total_discounts)'), 'total_discounts'],
        [this.app.models.Order.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        let data = count.map(c => {
          const total = parseInt(c.total_discounts, 10)
          return [parseInt(c.count, 10), total, c.currency]
        })

        if (data.length === 0) {
          data = [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.discountsRedeemed',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['total', 'gross', 'currency'],
          data: data
        }])
      })
  }

  /**
   * Failed Charges:
   * The number of failed charges in the last 30 days
   * Formula: Gross Processing Declines
   */
  failedCharges(options: {[key: string]: any} = {}) {
    const start = moment()
      .subtract(1, 'months')
      .startOf('hour')

    const end = moment(Date.now()).startOf('hour')

    return this.app.models.Transaction.findAll({
      where: {
        created_at: {
          $gte: start.format('YYYY-MM-DD HH:mm:ss')
        },
        status: 'cancelled'
      },
      attributes: [
        [this.app.models.Transaction.sequelize.literal('SUM(amount)'), 'total'],
        [this.app.models.Transaction.sequelize.literal('COUNT(id)'), 'count'],
        'currency'
      ],
      group: ['currency']
    })
      .then(count => {
        let data = count.map(c => {
          return [parseInt(c.get('count'), 10), parseInt(c.get('total'), 10), c.currency]
        })

        if (data.length === 0) {
          data = [[0, 0, this.app.config.get('cart.default_currency')]]
        }

        return this.publish([{
          name: 'store.cancelledSubscriptions',
          start: start.format('YYYY-MM-DD HH:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          group_label: 'currency',
          labels: ['total', 'gross', 'currency'],
          data: data
        }])
      })
  }
}
