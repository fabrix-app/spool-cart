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
  CollectionController: {
    uploadCSV: {
      'POST': [ 'CollectionPolicy.csv' ]
    }
  },
  CustomerController: {
    // '*': ['CartPolicy.session', 'CustomerPolicy.session'],
    create: {
      'POST': ['ProxyCartPolicy.clientDetails'],
      'PUT': ['ProxyCartPolicy.clientDetails']
    },
    uploadCSV: {
      'POST': [ 'CustomerPolicy.csv' ]
    }
  },
  SubscriptionController: {
    uploadCSV: {
      'POST': [ 'SubscriptionPolicy.csv' ]
    }
  },
  ProductController: {
    createImage: {
      'POST': ['ProductPolicy.image']
    },
    uploadCSV: {
      'POST': [ 'ProductPolicy.csv']
    },
    uploadMetaCSV: {
      'POST': [ 'ProductPolicy.csv']
    }
  },
  VendorController: {
    uploadCSV: {
      'POST': [ 'VendorPolicy.csv' ]
    }
  }
}
