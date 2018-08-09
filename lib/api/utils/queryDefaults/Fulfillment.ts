export const Fulfillment = {
  default: (app) => {
    return {
      include: [
        {
          model: app.models['OrderItem'].instance,
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
