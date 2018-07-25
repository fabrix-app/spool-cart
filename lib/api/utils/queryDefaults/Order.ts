module.exports = {
  default: (app) => {
    return {
      include: [
        // {
        //   model: app.models['Customer'],
        //   // as: 'customer'
        // },
        {
          model: app.models['OrderItem'],
          as: 'order_items'
        },
        {
          model: app.models['Transaction'],
          as: 'transactions'
        },
        {
          model: app.models['Fulfillment'],
          as: 'fulfillments',
          include: [
            {
              model: app.models['OrderItem'],
              as: 'order_items',
              attributes: ['id', 'quantity', 'fulfillment_status', 'fulfillment_service']
            }
          ]
        },
        {
          model: app.models['Refund'],
          as: 'refunds'
        },
        // {
        //   model: app.models['Event'],
        //   as: 'events'
        // },
        {
          model: app.models['Tag'],
          as: 'tags'
        }
      ],
      order: [
        [
          {
            model: app.models['OrderItem'],
            as: 'order_items'
          },
          'calculated_price'
        ],
        [
          {
            model: app.models['Transaction'],
            as: 'transactions'
          },
          'amount', 'DESC'
        ],
        // [
        //   {
        //     model: app.models['Event'],
        //     as: 'events'
        //   },
        //   'created_at', 'DESC'
        // ]
      ]
    }
  },
  customer: (app) => {
    return {
      include: [
        {
          model: app.models['Customer']
        }
      ]
    }
  },
  events: (app) => {
    return {
      include: [
        {
          model: app.models['Event'],
          as: 'events'
        }
      ],
      order: [
        {
          model: app.models['Event'],
          as: 'events'
        },
        'created_at', 'DESC'
      ]
    }
  },
  fulfillments: (app) => {
    return {
      include: [
        {
          model: app.models['Fulfillment'],
          as: 'fulfillments',
          include: [
            {
              model: app.models['OrderItem'],
              as: 'order_items',
              attributes: ['id', 'quantity', 'fulfillment_status', 'fulfillment_service']
            }
          ]
        }
      ]
    }
  },
  order_items: (app) => {
    return {
      include: [
        {
          model: app.models['OrderItem'],
          as: 'order_items'
        }
      ],
      order: [
        {
          model: app.models['OrderItem'],
          as: 'order_items'
        },
        'calculated_price'
      ]
    }
  },
  refunds: (app) => {
    return {
      include: [
        {
          model: app.models['Refund'],
          as: 'refunds'
        }
      ]
    }
  },
  subscription: (app) => {
    return {
      include: [
        {
          model: app.models['Subscription']
        }
      ]
    }
  },
  tags: (app) => {
    return {
      include: [
        {
          model: app.models['Tag'],
          as: 'tags'
        }
      ]
    }
  },
  transactions: (app) => {
    return {
      include: [
        {
          model: app.models['Transaction'],
          as: 'transactions'
        }
      ],
      order: [
        {
          model: app.models['Transaction'],
          as: 'transactions'
        },
        'amount', 'DESC'
      ]
    }
  }
}
