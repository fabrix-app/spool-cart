module.exports = {
  default: (app) => {
    return {
      include: [
        {
          model: app.models['Address'],
          as: 'default_address'
        },
        {
          model: app.models['Address'],
          as: 'shipping_address'
        },
        {
          model: app.models['Address'],
          as: 'billing_address'
        },
        // {
        //   model: app.models['Address'],
        //   as: 'addresses'
        // },
        {
          model: app.models['Tag'],
          as: 'tags',
          attributes: ['name', 'id']
        },
        {
          model: app.models['Metadata'],
          as: 'metadata',
          attributes: ['data', 'id']
        },
        {
          model: app.models['Cart'],
          as: 'default_cart'
        },
        // {
        //   model: app.models['Collection'],
        //   as: 'collections'
        // },
        // {
        //   model: app.models['Account'],
        //   as: 'accounts'
        // },
        // {
        //   model: app.models['Event'],
        //   as: 'events'
        // }
        // ,
        // {
        //   model: app.models['Order'],
        //   as: 'orders',
        //   attributes: [[app.models['Order'].sequelize.fn('COUNT', app.models['Order'].sequelize.col('orders.id')), 'orders_count']]
        // }
        // ,
        // {
        //   model: app.models['Cart'],
        //   as: 'carts'
        // }
      ]
    }
  },
  default_address: (app) => {
    return {
      include: [
        {
          model: app.models['Address'],
          as: 'default_address'
        }
      ]
    }
  },
  shipping_address: (app) => {
    return {
      include: [
        {
          model: app.models['Address'],
          as: 'shipping_address'
        }
      ]
    }
  },
  billing_address: (app) => {
    return {
      include: [
        {
          model: app.models['Address'],
          as: 'billing_address'
        }
      ]
    }
  },
  tags: (app) => {
    return {
      include: [
        {
          model: app.models['Tag'],
          as: 'tags',
          attributes: ['name', 'id']
        }
      ]
    }
  },
  metadata: (app) => {
    return {
      include: [
        {
          model: app.models['Metadata'],
          as: 'metadata',
          attributes: ['data', 'id']
        }
      ]
    }
  },
  default_cart: (app) => {
    return {
      include: [
        {
          model: app.models['Cart'],
          as: 'default_cart'
        }
      ]
    }
  },
  collections: (app) => {
    return {
      include: [
        {
          model: app.models['Collection'],
          as: 'collections'
        }
      ]
    }
  },
  accounts: (app) => {
    return {
      include: [
        {
          model: app.models['Account'],
          as: 'accounts'
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
        [
          {
            model: app.models['Event'],
            as: 'events'
          },
          'created_at', 'DESC'
        ]
      ]
    }
  }
}
