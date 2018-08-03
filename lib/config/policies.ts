export const policies = {
  CartController: {
    // '*': ['CartPolicy.session', 'CustomerPolicy.session'],
    create: {
      'POST': ['ProxyCartPolicy.clientDetails'],
      'PUT': ['ProxyCartPolicy.clientDetails']
    },
    checkout: {
      'POST': ['ProxyCartPolicy.clientDetails'],
      'PUT': ['ProxyCartPolicy.clientDetails']
    }
  },
  CustomerController: {
    // '*': ['CartPolicy.session', 'CustomerPolicy.session'],
    create: {
      'POST': ['ProxyCartPolicy.clientDetails'],
      'PUT': ['ProxyCartPolicy.clientDetails']
    }
  }
}
