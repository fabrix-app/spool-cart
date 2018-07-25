module.exports = {
  default: (app) => {
    return {
      include: [
        {
          model: app.models['Address'],
          as: 'billing_address'
        },
        {
          model: app.models['Address'],
          as: 'shipping_address'
        }
      ]
    }
  }
}
