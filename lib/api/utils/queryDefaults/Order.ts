export const Order = {
  default: (app) => {
    return {
      include: [
        // {
        //   model: app.models['Customer'],
        //   // as: 'customer'
        // },
        {
          model: app.models['OrderItem'].instance,
          as: 'order_items'
        },
        {
          model: app.models['Transaction'].instance,
          as: 'transactions'
        },
        {
          model: app.models['Fulfillment'].instance,
          as: 'fulfillments',
          include: [
            {
              model: app.models['OrderItem'].instance,
              as: 'order_items',
              attributes: ['id', 'quantity', 'fulfillment_status', 'fulfillment_service']
            }
          ]
        },
        {
          model: app.models['Refund'].instance,
          as: 'refunds'
        },
        // {
        //   model: app.models['Event'],
        //   as: 'events'
        // },
        {
          model: app.models['Tag'].instance,
          as: 'tags'
        }
      ],
      order: [
        [
          {
            model: app.models['OrderItem'].instance,
            as: 'order_items'
          },
          'calculated_price'
        ],
        [
          {
            model: app.models['Transaction'].instance,
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
          model: app.models['Customer'].instance
        }
      ]
    }
  },
  events: (app) => {
    return {
      include: [
        {
          model: app.models['Event'].instance,
          as: 'events'
        }
      ],
      order: [
        {
          model: app.models['Event'].instance,
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
          model: app.models['Fulfillment'].instance,
          as: 'fulfillments',
          include: [
            {
              model: app.models['OrderItem'].instance,
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
          model: app.models['OrderItem'].instance,
          as: 'order_items'
        }
      ],
      order: [
        {
          model: app.models['OrderItem'].instance,
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
          model: app.models['Refund'].instance,
          as: 'refunds'
        }
      ]
    }
  },
  subscription: (app) => {
    return {
      include: [
        {
          model: app.models['Subscription'].instance
        }
      ]
    }
  },
  tags: (app) => {
    return {
      include: [
        {
          model: app.models['Tag'].instance,
          as: 'tags'
        }
      ]
    }
  },
  transactions: (app) => {
    return {
      include: [
        {
          model: app.models['Transaction'].instance,
          as: 'transactions'
        }
      ],
      order: [
        {
          model: app.models['Transaction'].instance,
          as: 'transactions'
        },
        'amount', 'DESC'
      ]
    }
  }
}
