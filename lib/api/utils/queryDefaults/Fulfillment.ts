module.exports = {
  default: (app) => {
    return {
      include: [
        {
          model: app.models['OrderItem'],
          as: 'order_items',
          attributes: [
            'id',
            'quantity',
            'requires_shipping',
            'fulfillment_status',
            'fulfillment_service'
          ]
        }
      ]
    }
  }
}
