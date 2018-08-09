export const Cart = {
  default: (app) => {
    return {
      include: [
        {
          model: app.models['Address'].instance,
          as: 'billing_address'
        },
        {
          model: app.models['Address'].instance,
          as: 'shipping_address'
        }
      ]
    }
  }
}
