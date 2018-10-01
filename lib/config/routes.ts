import * as joi from 'joi'
// const Schemas = require('./schemas')

export const routes = {
  '/generalStats': {
    'GET': 'ProxyCartController.generalStats',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.object()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetGeneralStatsRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/gateways': {
    'GET': 'GatewayController.gateways',
    config: {
      prefix: 'cart.prefix',
      validate: {},
      app: {
        permissions: {
          resource_name: 'apiGetGatewaysRoute',
          roles: ['admin', 'registered', 'public']
        }
      }
    }
  },
  '/countries': {
    'GET': 'CountryController.countries',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any(),
          include: joi.array().items(joi.string())
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCountriesRoute',
          roles: ['admin', 'registered', 'public']
        }
      }
    }
  },
  '/provinces': {
    'GET': 'CountryController.provinces',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any(),
          include: joi.array().items(joi.string())
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetProvincesRoute',
          roles: ['admin', 'registered', 'public']
        }
      }
    }
  },
  '/counties': {
    'GET': 'CountryController.counties',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any(),
          include: joi.array().items(joi.string())
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCountiesRoute',
          roles: ['admin', 'registered', 'public']
        }
      }
    }
  },
  '/cities': {
    'GET': 'CountryController.cities',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any(),
          include: joi.array().items(joi.string())
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCitiesRoute',
          roles: ['admin', 'registered', 'public']
        }
      }
    }
  },
  '/country': {
    'POST': 'CountryController.createCountry',
    config: {
      prefix: 'cart.prefix',
      app: {
        permissions: {
          resource_name: 'apiPostCountryRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/country/:id/provinces': {
    'GET': 'CountryController.countryProvinces',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.number()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCountryIdProvincesRoute',
          roles: ['admin', 'registered', 'public']
        }
      }
    }
  },
  '/country/:id': {
    'GET': {
      handler: 'CountryController.country',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCountryIdRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    },
    'POST': {
      handler: 'CountryController.updateCountry',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCountryIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CountryController.updateCountry',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCountryIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CountryController.destroyCountry',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCountryIdRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/country/:id/addProvince/:province': {
    'POST': 'CountryController.addProvince',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.number(),
          province: joi.any()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiPostCountryIdAddProvinceProvinceRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/country/:id/removeProvince/:province': {
    'POST': 'CountryController.removeProvince',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.number(),
          province: joi.any()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiPostCountryIdRemoveProvinceProvinceRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/province': {
    'POST': 'CountryController.createProvince',
    config: {
      prefix: 'cart.prefix',
      app: {
        permissions: {
          resource_name: 'apiPostProvinceRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/province/:id': {
    'GET': 'CountryController.province',
    'POST': {
      handler: 'CountryController.updateProvince',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProvinceIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CountryController.updateProvince',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProvinceIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CountryController.destroyProvince',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteProvinceIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.number()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetProvinceIdRoute',
          roles: ['admin', 'registered', 'public']
        }
      }
    }
  },
  '/county': {
    'POST': 'CountryController.createCounty',
    config: {
      prefix: 'cart.prefix',
      app: {
        permissions: {
          resource_name: 'apiPostCountyRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/county/:id': {
    'GET': 'CountryController.county',
    'POST': {
      handler: 'CountryController.updateCounty',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCountyIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CountryController.updateCounty',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCountyIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CountryController.destroyCounty',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCountyIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.number()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCountyIdRoute',
          roles: ['admin', 'registered', 'public']
        }
      }
    }
  },
  '/city': {
    'POST': 'CountryController.createCity',
    config: {
      prefix: 'cart.prefix',
      app: {
        permissions: {
          resource_name: 'apiPostCityRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/city/:id': {
    'GET': 'CountryController.city',
    'POST': {
      handler: 'CountryController.updateCity',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCityIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CountryController.updateCity',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCityIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CountryController.destroyCity',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCityIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.number()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCityIdRoute',
          roles: ['admin', 'registered', 'public']
        }
      }
    }
  },
  // Cart
  '/carts': {
    'GET': 'CartController.findAll',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any(),
          include: joi.array().items(joi.string())
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCartsRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/cart': {
    'GET': {
      handler: 'CartController.session',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiGetCartRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    },
    'POST': {
      handler: 'CartController.create',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCartRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.update',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPutCartRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    }
  },
  '/cart/draft': {
    'POST': 'CartController.draft',
    config: {
      prefix: 'cart.prefix',
      app: {
        permissions: {
          resource_name: 'apiPostCartDraftRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/cart/:id': {
    'GET': {
      handler: 'CartController.resolve',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCartIdRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'POST': {
      handler: 'CartController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCartIdRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    }
  },
  '/cart/:id/addShipping': {
    'POST': {
      handler: 'CartController.addShipping',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdAddShippingRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.addShipping',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCartIdAddShippingRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/cart/:id/removeShipping': {
    'POST': {
      handler: 'CartController.removeShipping',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdRemoveShippingRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.removeShipping',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCartIdRemoveShippingRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/cart/:id/addTaxes': {
    'POST': {
      handler: 'CartController.addTaxes',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdAddTaxesRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.addTaxes',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCartIdAddTaxesRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/cart/:id/removeTaxes': {
    'POST': {
      handler: 'CartController.removeTaxes',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdRemoveTaxesRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.removeTaxes',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCartIdRemoveTaxesRoute',
            roles: ['admin']
          }
        }
      }
    }

  },
  '/cart/generalStats': {
    'GET': 'CartController.generalStats',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any(),
          include: joi.array().items(joi.string())
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCartGeneralStatsRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/cart/count': {
    'GET': 'CartController.count',
    config: {
      prefix: 'cart.prefix',
      app: {
        permissions: {
          resource_name: 'apiGetCartCountRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/cart/init': {
    'GET': {
      handler: 'CartController.init',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiGetCartInitRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    },
    'POST': {
      handler: 'CartController.init',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCartInitRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    }
  },
  '/cart/session': {
    'GET': {
      handler: 'CartController.session',
      config: {
        prefix: 'cart.prefix',
        app: {}
      }
    }
  },
  '/cart/logout': {
    'POST': {
      handler: 'CartController.logout',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCartLogoutRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.logout',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPutCartLogoutRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/cart/checkout': {
    'POST': {
      handler: 'CartController.checkout',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCartCheckoutRoute',
            roles: ['public', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.checkout',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPutCartCheckoutRoute',
            roles: ['public', 'registered']
          }
        }
      }
    }
  },
  '/cart/addItems': {
    'POST': {
      handler: 'CartController.addItems',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCartAddItemsRoute',
            roles: ['public', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.addItems',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPutCartAddItemsRoute',
            roles: ['public', 'registered']
          }
        }
      }
    }
  },
  '/cart/removeItems': {
    'POST': {
      handler: 'CartController.removeItems',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCartRemoveItemsRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.removeItems',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPutCartRemoveItemsRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/cart/clear': {
    'POST': {
      handler: 'CartController.clear',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCartClearRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/cart/login': {
    'POST': {
      handler: 'CartController.login',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCartLoginRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/cart/:id/login': {
    'POST': {
      handler: 'CartController.login',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdLoginRoute',
            roles: ['public', 'registered']
          }
        }
      }
    }
  },
  '/cart/:id/checkout': {
    'POST': {
      handler: 'CartController.checkout',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdCheckoutRoute',
            roles: ['public', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.checkout',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCartIdCheckoutRoute',
            roles: ['public', 'registered']
          }
        }
      }
    }
  },
  '/cart/:id/checkout/:customer': {
    'POST': {
      handler: 'CartController.checkout',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required(),
            customer: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdCheckoutCustomerRoute',
            roles: ['public', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.checkout',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required(),
            customer: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCartIdCheckoutCustomerRoute',
            roles: ['public', 'registered']
          }
        }
      }
    }
  },
  '/cart/:id/customer': {
    'GET': {
      handler: 'CartController.customer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCartIdCustomerRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/cart/:id/switch': {
    'POST': {
      handler: 'CartController.switchCart',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdSwitchRoute',
            roles: ['public', 'registered']
          }
        }
      }
    }
  },
  '/cart/:id/addItems': {
    'POST': {
      handler: 'CartController.addItems',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdAddItemsRoute',
            roles: ['public', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.addItems',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCartIdAddItemsRoute',
            roles: ['public', 'registered']
          }
        }
      }
    }
  },
  '/cart/:id/removeItems': {
    'POST': {
      handler: 'CartController.removeItems',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdRemoveItemsRoute',
            roles: ['public', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.removeItems',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCartIdRemoveItemsRoute',
            roles: ['public', 'registered']
          }
        }
      }
    }
  },
  '/cart/:id/pricingOverrides': {
    'POST': {
      handler: 'CartController.pricingOverrides',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdPricingOverridesRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.pricingOverrides',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCartIdPricingOverridesRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/cart/:id/clear': {
    'POST': {
      handler: 'CartController.clear',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCartIdClearRoute',
            roles: ['public', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CartController.clear',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCartIdClearRoute',
            roles: ['public', 'registered']
          }
        }
      }
    }
  },
  // Collections
  '/collections': {
    'GET': {
      handler: 'CollectionController.findAll',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCollectionsRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/collection': {
    'POST': {
      handler: 'CollectionController.create',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCollectionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/:id': {
    'GET': {
      handler: 'CollectionController.findById',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCollectionIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'CollectionController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CollectionController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCollectionIdRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/:id/collection/:collection': {
    'POST': {
      handler: 'CollectionController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CollectionController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCollectionIdCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO Legacy
  '/collection/:id/addCollection/:collection': {
    'POST': {
      handler: 'CollectionController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdAddCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/:id/collections': {
    'GET': {
      handler: 'CollectionController.collections',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCollectionIdCollectionsRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    },
    'POST': {
      handler: 'CollectionController.addCollections',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdCollectionsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CollectionController.addCollections',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCollectionIdCollectionsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CollectionController.removeCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCollectionIdCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/collection/:id/removeCollection/:collection': {
    'POST': {
      handler: 'CollectionController.removeCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCollectionIdRemoveCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/:id/addProduct/:product': {
    'POST': {
      handler: 'CollectionController.addProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdAddProductProductRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CollectionController.addProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCollectionIdAddProductProductRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/:id/product/:product': {
    'POST': {
      handler: 'CollectionController.addProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdProductProductRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CollectionController.addProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCollectionIdProductProductRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CollectionController.removeProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCollectionIdProductProductRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/collection/:id/removeProduct/:product': {
    'POST': {
      handler: 'CollectionController.removeProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdRemoveProductProductRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/:id/products': {
    'GET': {
      handler: 'CollectionController.products',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCollectionIdProductsRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    },
    'POST': {
      handler: 'CollectionController.addProducts',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdProductsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CollectionController.addProducts',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCollectionIdProductsRoute',
            roles: ['admin']
          }
        }
      }
    },
    // 'DELETE': {
    //
    // }
  },
  '/collection/:id/discounts': {
    'GET': {
      handler: 'CollectionController.discounts',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCollectionIdDiscountsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/:id/addTag/:tag': {
    'POST': {
      handler: 'CollectionController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdAddTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CollectionController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCollectionIdAddTagTagRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/:id/tag/:tag': {
    'POST': {
      handler: 'CollectionController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CollectionController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCollectionIdTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CollectionController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCollectionIdTagTagRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/collection/:id/removeTag/:tag': {
    'POST': {
      handler: 'CollectionController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdRemoveTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CollectionController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCollectionIdRemoveTagTagRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/:id/tags': {
    'GET': {
      handler: 'CollectionController.tags',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCollectionIdTagsRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    }
  },
  // TODO legacy
  '/collection/:id/addCustomer/:customer': {
    'POST': {
      handler: 'CollectionController.addCustomer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            customer: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdAddCustomerCustomerRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CollectionController.addCustomer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            customer: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCollectionIdAddCustomerCustomerRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/:id/customer/:customer': {
    'POST': {
      handler: 'CollectionController.addCustomer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            customer: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdCustomerCustomerRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CollectionController.addCustomer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            customer: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCollectionIdCustomerCustomerRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/:id/customers': {
    'GET': {
      handler: 'CollectionController.customers',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCollectionIdCustomersRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/handle/:handle': {
    'GET': {
      handler: 'CollectionController.findByHandle',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            handle: joi.string().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCollectionHandleRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    },
    'POST': {
      handler: 'CollectionController.addCustomers',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdCustomersRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CollectionController.addCustomers',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCollectionIdCustomersRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CollectionController.removeCustomer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            customer: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCollectionIdCustomerCustomerRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/collection/:id/removeCustomer/:customer': {
    'POST': {
      handler: 'CollectionController.removeCustomer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            customer: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionIdRemoveCustomerCustomerRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/count': {
    'GET': {
      handler: 'CollectionController.count',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiGetCollectionCountRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/collection/generalStats': {
    'GET': {
      handler: 'CollectionController.generalStats',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiGetCollectionGeneralStatsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collections/search': {
    'GET': {
      handler: 'CollectionController.search',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any().optional(),
            term: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCollectionsSearchRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/collection/uploadCSV': {
    'POST': {
      handler: 'CollectionController.uploadCSV',
      config: {
        prefix: 'cart.prefix',
        pre: ['CollectionPolicy.csv'],
        app: {
          permissions: {
            resource_name: 'apiPostCollectionUploadCsvRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/collection/processUpload/:id': {
    'POST': {
      handler: 'CollectionController.processUpload',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            // This is a only ever a String
            id: joi.string().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCollectionProcessUploadRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // Customer
  '/customers': {
    'GET': {
      handler: 'CustomerController.findAll',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomersRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer': {
    'GET': {
      handler: 'CustomerController.session',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiGetCustomerRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    },
    'POST': {
      handler: 'CustomerController.createAndLogin',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCustomerRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.update',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPutCustomerRoute',
            roles: ['registered', 'admin']
          }
        }
      }
    }
  },
  '/customer/create': {
    'POST': {
      handler: 'CustomerController.create',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCustomerCreateRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/processUpload/:id': {
    'POST': {
      handler: 'CustomerController.processUpload',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            // This is a only ever a String
            id: joi.string().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerProcessUploadRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/token/:token': {
    'GET': {
      handler: 'CustomerController.findByToken',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            token: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerTokenTokenRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/:id/discounts': {
    'GET': 'CustomerController.discounts',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCustomerIdDiscountsRoute',
          roles: ['admin', 'registered']
        }
      }
    }
  },
  '/customer/:id/reviews': {
    'GET': 'CustomerController.reviews',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCustomerIdReviewsRoute',
          roles: ['admin', 'registered', 'public']
        }
      }
    }
  },
  '/customer/generalStats': {
    'GET': 'CustomerController.generalStats',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCustomerGeneralStatsRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/customer/count': {
    'GET': 'CustomerController.count',
    config: {
      prefix: 'cart.prefix',
      app: {
        permissions: {
          resource_name: 'apiGetCustomerCountRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/customer/export': {
    'POST': 'CustomerController.exportCustomers',
    config: {
      prefix: 'cart.prefix',
      app: {
        permissions: {
          resource_name: 'apiPostCustomerExportRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/customers/search': {
    'GET': 'CustomerController.search',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any().optional(),
          term: joi.string().required(),
          include: joi.array().items(joi.string())
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCustomersSearchRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/customer/:id': {
    'GET': {
      handler: 'CustomerController.findById',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerIdRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'POST': {
      handler: 'CustomerController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/:id/accountBalance': {
    'POST': {
      handler: 'CustomerController.accountBalance',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdAccountBalanceRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.accountBalance',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdAccountBalanceRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/enable': {
    'PUT': 'CustomerController.enable',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiPutCustomerIdEnableRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/customer/:id/disable': {
    'PUT': 'CustomerController.disable',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiPutCustomerIdDisableRoute',
          roles: ['admin']
        }
      }
    }
  },
  // TODO legacy
  '/customer/:id/addTag/:tag': {
    'POST': {
      handler: 'CustomerController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdAddTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdAddTagTagRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/tag/:tag': {
    'POST': {
      handler: 'CustomerController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdPostTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CustomerController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCustomerIdTagTagRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/customer/:id/removeTag/:tag': {
    'POST': {
      handler: 'CustomerController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdRemoveTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdRemoveTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CustomerController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCustomerIdRemoveTagTagRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/customer/:id/addCollection/:collection': {
    'POST': {
      handler: 'CustomerController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdAddCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdAddCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/collections': {
    'GET': {
      handler: 'CustomerController.collections',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerIdCollectionsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'CustomerController.addCollections',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdCollectionsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.addCollections',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdCollectionsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/collection/:collection': {
    'POST': {
      handler: 'CustomerController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CustomerController.removeCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCustomerIdCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/customer/:id/removeCollection/:collection': {
    'POST': {
      handler: 'CustomerController.removeCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdRemoveCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.removeCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdRemoveCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/login': {
    'POST': 'CustomerController.login',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiPostCustomerIdLoginRoute',
          roles: ['public', 'registered', 'admin']
        }
      }
    }
  },
  '/customer/:id/source': {
    'POST': {
      handler: 'CustomerController.addSource',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdSourceRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/source/:source': {
    'POST': {
      handler: 'CustomerController.updateSource',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            source: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdSourceIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.updateSource',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            source: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdSourceIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CustomerController.destroySource',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            source: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCustomerIdSourceSourceRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // Customer Address
  '/customer/:id/address': {
    'POST': {
      handler: 'CustomerController.addAddress',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdAddressRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/address/:address': {
    'POST': {
      handler: 'CustomerController.updateAddress',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            address: joi.any().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdAddressAddressRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.updateAddress',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            address: joi.any().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdAddressAddressRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CustomerController.destroyAddress',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            address: joi.any().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCustomerIdAddressAddressRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/event/:event': {
    'DELETE': {
      handler: 'CustomerController.destroyEvent',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCustomerIdEventEventRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/accounts': {
    'GET': 'CustomerController.accounts',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        },
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any(),
          include: joi.array().items(joi.string())
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCustomerIdAccountsRoute',
          roles: ['admin', 'registered']
        }
      }
    }
  },
  '/customer/:id/account/:account': {
    'GET': 'CustomerController.customerAccount',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required(),
          account: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCustomerIdAccountAccountRoute',
          roles: ['admin', 'registered']
        }
      }
    }
  },

  '/customer/:id/account/:account/sources': {
    'GET': 'CustomerController.customerAccountSources',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required(),
          account: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        },
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any(),
          include: joi.array().items(joi.string())
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCustomerIdAccountAccountSourcesRoute',
          roles: ['admin', 'registered']
        }
      }
    }
  },

  '/customer/:id/account/:account/transactions': {
    'GET': {
      handler: 'CustomerController.accountTransactions',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            account: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerIdAccountAccountTransactionsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },

  '/customer/:id/addresses': {
    'GET': 'CustomerController.addresses',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        },
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any(),
          include: joi.array().items(joi.string())
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCustomerIdAddressesRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/customer/:id/tags': {
    'GET': 'CustomerController.tags',
    config: {
      prefix: 'cart.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        },
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any(),
          include: joi.array().items(joi.string())
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetCustomerIdTagsRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/customer/:id/user/:user': {
    'GET': {
      handler: 'CustomerController.user',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            user: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerIdUserUserRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'CustomerController.addUser',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            user: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdUserUserRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.addUser',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            user: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdUserUserRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CustomerController.removeUser',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            user: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCustomerIdUserUserRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/customer/:id/addUsers': {
    'POST': {
      handler: 'CustomerController.addUsers',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdAddUsersRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.addUsers',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdAddUsersRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/users': {
    'GET': {
      handler: 'CustomerController.users',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerIdUsersRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'CustomerController.addUsers',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdUsersRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.addUsers',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerIdUsersRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/orders': {
    'GET': {
      handler: 'CustomerController.orders',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerIdOrdersRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/:id/events': {
    'GET': {
      handler: 'CustomerController.events',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerIdEventsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/sources': {
    'GET': {
      handler: 'CustomerController.sources',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerIdSourcesRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/subscriptions': {
    'GET': {
      handler: 'CustomerController.subscriptions',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerIdSubscriptionsRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/account/:account': {
    'GET': {
      handler: 'CustomerController.account',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            account: joi.any().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerAccountAccountRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/user/:user': {
    'GET': {
      handler: 'CustomerController.user',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            user: joi.any().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerUserUserRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/order/:order': {
    'GET': {
      handler: 'CustomerController.order',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            order: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerOrderOrderRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/isSubscribed/:product': {
    'GET': {
      handler: 'CustomerController.isSubscribedToProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerIsSubscribedProductRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/hasPurchased/:product': {
    'GET': {
      handler: 'CustomerController.hasPurchasedProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerHasPurchasedProductRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/source': {
    'POST': {
      handler: 'CustomerController.addSource',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCustomerSourceRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/source/:source': {
    'GET': {
      handler: 'CustomerController.source',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            source: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerSourceSourceRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'POST': {
      handler: 'CustomerController.updateSource',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            source: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerSourceSourceRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.updateSource',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            source: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerSourceSourceRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CustomerController.destroySource',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            source: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCustomerSourceSourceRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/tag/:tag': {
    'GET': {
      handler: 'CustomerController.findByTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            tag: joi.string().required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerTagTagRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/customer/collection/:handle': {
    'GET': {
      handler: 'CustomerController.findByCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            handle: joi.string().required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerCollectionHandleRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  // Customer Addresses
  '/customer/address': {
    'POST': {
      handler: 'CustomerController.addAddress',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCustomerAddressRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/address/:address': {
    'GET': {
      handler: 'CustomerController.address',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            address: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerAddressAddressRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'POST': {
      handler: 'CustomerController.updateAddress',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            address: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerAddressAddressRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.updateAddress',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            address: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerAddressAddressRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'DELETE': {
      handler: 'CustomerController.destroyAddress',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            address: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteCustomerAddressAddressRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/login': {
    'POST': {
      path: '/customer/login',
      handler: 'CustomerController.login',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCustomerLoginRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/customer/logout': {
    'POST': {
      handler: 'CustomerController.logout',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostCustomerLogoutRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/customer/accounts': {
    'GET': {
      handler: 'CustomerController.accounts',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerAccountsRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/addresses': {
    'GET': {
      handler: 'CustomerController.addresses',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerAddressesRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/collections': {
    'GET': {
      handler: 'CustomerController.collections',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerCollectionsRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/events': {
    'GET': {
      handler: 'CustomerController.events',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerEventsRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/orders': {
    'GET': {
      handler: 'CustomerController.orders',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerOrdersRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/tags': {
    'GET': {
      handler: 'CustomerController.tags',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerTagsRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/sources': {
    'GET': {
      handler: 'CustomerController.sources',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerSourcesRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/subscription/:subscription': {
    'GET': {
      handler: 'CustomerController.subscription',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            subscription: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerSubscriptionSubscriptionRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'POST': {
      handler: 'CustomerController.subscriptionUpdate',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            subscription: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerSubscriptionSubscriptionRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.subscriptionUpdate',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            subscription: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerSubscriptionSubscriptionRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },

  '/customer/subscription/:subscription/activate': {
    'POST': {
      handler: 'CustomerController.subscriptionActivate',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            subscription: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerSubscriptionSubscriptionActivateRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.subscriptionActivate',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            subscription: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerSubscriptionSubscriptionActivateRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/subscription/:subscription/deactivate': {
    'POST': {
      handler: 'CustomerController.subscriptionDeactivate',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            subscription: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerSubscriptionSubscriptionDeactivateRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'CustomerController.subscriptionDeactivate',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            subscription: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerSubscriptionSubscriptionDeactivateRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/subscription/:subscription/renew': {
    'POST': {
      handler: 'SubscriptionController.renew',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            subscription: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerSubscriptionSubscriptionRenewRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'SubscriptionController.renew',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            subscription: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutCustomerSubscriptionSubscriptionRenewRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/subscription/:subscription/addItems': {
    'POST': {
      handler: 'CustomerController.subscriptionAddItems',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            subscription: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerSubscriptionSubscriptionAddItemsRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/subscription/:subscription/cancel': {
    'POST': {
      handler: 'CustomerController.subscriptionCancel',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            subscription: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerSubscriptionSubscriptionCancelRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/subscription/:subscription/removeItems': {
    'POST': {
      handler: 'CustomerController.subscriptionRemoveItems',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            subscription: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerSubscriptionSubscriptionRemoveItemsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/subscriptions': {
    'GET': {
      handler: 'CustomerController.subscriptions',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerSubscriptionsRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/session': {
    'GET': {
      handler: 'CustomerController.session',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiGetCustomerSessionRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/customer/:product/isSubscribedToProduct': {
    'GET': {
      handler: 'CustomerController.isSubscribedToProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerProductIsSubscribedToProductRoute',
            roles: ['registered', 'admin']
          }
        }
      }
    }
  },
  '/customer/:product/hasPurchasedProduct': {
    'GET': {
      handler: 'CustomerController.hasPurchasedProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerProductHasPurchasedProductRoute',
            roles: ['registered', 'admin']
          }
        }
      }
    }
  },
  '/customer/users': {
    'GET': {
      handler: 'CustomerController.users',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetCustomerUsersRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/customer/uploadCSV': {
    'POST': {
      handler: 'CustomerController.uploadCSV',
      config: {
        prefix: 'cart.prefix',
        pre: ['CustomerPolicy.csv'],
        app: {
          permissions: {
            resource_name: 'apiPostCustomerUploadCsvRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/customer/:id/switch': {
    'POST': {
      handler: 'CustomerController.switchCustomer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostCustomerIdSwitchRoute',
            roles: ['public', 'registered']
          }
        }
      }
    }
  },
  // Discount
  '/discount/generalStats': {
    'GET': {
      handler: 'DiscountController.generalStats',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetDiscountGeneralStatsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/discounts': {
    'GET': {
      handler: 'DiscountController.findAll',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetDiscountsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/discounts/search': {
    'GET': {
      handler: 'DiscountController.search',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            term: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetDiscountsSearchRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/discount/handle/:handle': {
    'GET': {
      handler: 'DiscountController.findByHandle',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            handle: joi.string().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetDiscountHandleHandleRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    }
  },
  '/discount': {
    'POST': {
      handler: 'DiscountController.create',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostDiscountRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/discount/:id': {
    'GET': {
      handler: 'DiscountController.findById',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetDiscountIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'DiscountController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostDiscountIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'DiscountController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutDiscountIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'DiscountController.destroy',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteDiscountIdRoute',
            roles: ['admin']
          }
        }
      }
    }
  },

  '/discount/:id/product/:product': {
    'POST': {
      handler: 'DiscountController.addProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostDiscountIdProductProductRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'DiscountController.addProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutDiscountIdProductProductRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'DiscountController.removeProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            product: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteDiscountIdProductProductRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/discount/:id/events': {
    'GET': {
      handler: 'DiscountController.events',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetDiscountIdEventsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/discount/:id/products': {
    'GET': {
      handler: 'DiscountController.products',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetDiscountIdProductsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'DiscountController.addProducts',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostDiscountIdProductsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'DiscountController.addProducts',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutDiscountIdProductsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/discount/:id/customer/:customer': {
    'POST': {
      handler: 'DiscountController.addCustomer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            customer: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostDiscountIdCustomerCustomerRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'DiscountController.addCustomer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            customer: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutDiscountIdCustomerCustomerRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'DiscountController.removeCustomer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            customer: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteDiscountIdCustomerCustomerRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/discount/:id/customers': {
    'GET': {
      handler: 'DiscountController.customers',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetDiscountIdCustomersRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'DiscountController.addCustomers',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostDiscountIdCustomersRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'DiscountController.addCustomers',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutDiscountIdCustomersRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/discount/:id/cart/:cart': {
    'POST': {
      handler: 'DiscountController.addCart',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            cart: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostDiscountIdCartCartRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'DiscountController.addCart',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            cart: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutDiscountIdCartCartRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'DiscountController.removeCart',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            cart: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteDiscountIdCartCartRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/discount/:id/carts': {
    'GET': {
      handler: 'DiscountController.carts',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetDiscountIdCartsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/discount/:id/collection/:collection': {
    'POST': {
      handler: 'DiscountController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostDiscountIdCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'DiscountController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutDiscountIdCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'DiscountController.removeCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteDiscountIdCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/discount/:id/collections': {
    'GET': {
      handler: 'DiscountController.collections',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetDiscountIdCollectionsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'DiscountController.addCollections',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostDiscountIdCollectionsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'DiscountController.addCollections',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutDiscountIdCollectionsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },

  // Fulfillment
  '/fulfillments': {
    'GET': {
      handler: 'FulfillmentController.findAll',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetFulfillmentsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'FulfillmentController.create',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostFulfillmentRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/fulfillment/generalStats': {
    'GET': 'FulfillmentController.generalStats',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetFulfillmentGeneralStatsRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/fulfillment/:id': {
    'POST': {
      handler: 'FulfillmentController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostFulfillmentIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'FulfillmentController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutFulfillmentIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'FulfillmentController.destroy',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteFulfillmentIdRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // Products
  // TODO make this resolve instead of by Id only
  '/product/:id': {
    'GET': {
      handler: 'ProductController.findById',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.updateProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'ProductController.removeProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteProductIdRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/products/search': {
    'GET': {
      handler: 'ProductController.search',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any().optional(),
            term: joi.string().required(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductsSearchRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/product/tag/:tag': {
    'GET': {
      handler: 'ProductController.findByTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductTagTagRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/product/handle/:handle': {
    'GET': {
      handler: 'ProductController.findByHandle',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            handle: joi.string().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductHandleHandleRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/product/collection/:handle': {
    'GET': {
      handler: 'ProductController.findByCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            handle: joi.string().required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductCollectionHandleRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/product/collection/:handle/search': {
    'GET': {
      handler: 'ProductController.searchByCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            handle: joi.string().required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            term: joi.string(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductCollectionHandleSearchRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/product/generalStats': {
    'GET': {
      handler: 'ProductController.generalStats',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductGeneralStatsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/count': {
    'GET': {
      handler: 'ProductController.count',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiGetProductCountRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product': {
    'POST': {
      handler: 'ProductController.addProduct',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostProductRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/add': {
    'POST': {
      handler: 'ProductController.addProduct',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostProductAddRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/products': {
    'GET': {
      handler: 'ProductController.findAll',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductsRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    },
    'POST': {
      handler: 'ProductController.addProducts',
      config: {
        app: {
          permissions: {
            resource_name: 'apiPostProductsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.updateProducts',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPutProductsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO Legacy
  '/product/addProducts': {
    'POST': {
      handler: 'ProductController.addProducts',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostProductAddProductsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/update': {
    'POST': {
      handler: 'ProductController.updateProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdUpdateRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.updateProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdUpdateRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/:id/addTag/:tag': {
    'POST': {
      handler: 'ProductController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdAddTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdAddTagTagRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/tag/:tag': {
    'POST': {
      handler: 'ProductController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'ProductController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteProductIdTagTagRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/:id/removeTag/:tag': {
    'POST': {
      handler: 'ProductController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdRemoveTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdRemoveTagTagRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/:id/addCollection/:collection': {
    'POST': {
      handler: 'ProductController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdAddCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdAddCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/collection/:collection': {
    'POST': {
      handler: 'ProductController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'ProductController.removeCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteProductIdCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/:id/removeCollection/:collection': {
    'POST': {
      handler: 'ProductController.removeCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdRemoveCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.removeCollection',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            collection: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdRemoveCollectionCollectionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/:id/addAssociation/:association': {
    'POST': {
      handler: 'ProductController.addAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdAddAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdAddAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    }
  },

  '/product/:id/association/:association': {
    'POST': {
      handler: 'ProductController.addAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'ProductController.removeAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteProductIdAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/:id/removeAssociation/:association': {
    'POST': {
      handler: 'ProductController.removeAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdRemoveAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.removeAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdRemoveAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/variant/:id/addAssociation/:association': {
    'POST': {
      handler: 'ProductController.addVariantAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductVariantIdAddAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addVariantAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductVariantIdAddAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/variant/:id/removeAssociation/:association': {
    'POST': {
      handler: 'ProductController.removeVariantAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductVariantIdRemoveAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.removeVariantAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductVariantIdRemoveAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/:id/variant/:variant/addAssociation/:association': {
    'POST': {
      handler: 'ProductController.addVariantAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdVariantVariantAddAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addVariantAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdVariantVariantAddAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/variant/:variant/association/:association': {
    'POST': {
      handler: 'ProductController.addVariantAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdVariantVariantAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addVariantAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdVariantVariantAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'ProductController.removeVariantAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteProductIdVariantVariantAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/variant/:variant/removeAssociation/:association': {
    'POST': {
      handler: 'ProductController.removeVariantAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdVariantVariantRemoveAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.removeVariantAssociation',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            association: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdVariantVariantRemoveAssociationAssociationRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/variant/:variant/associations': {
    'GET': {
      handler: 'ProductController.variantAssociations',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdVariantVariantAssociationsRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    },
    'POST': {
      handler: 'ProductController.addVariantAssociations',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdVariantVariantAssociationsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/addShop/:shop': {
    'POST': {
      handler: 'ProductController.addShop',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            shop: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdAddShopShopRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addShop',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            shop: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdAddShopShopRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/shop/:shop': {
    'POST': {
      handler: 'ProductController.addShop',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            shop: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdShopShopRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addShop',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            shop: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdShopShopRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'ProductController.removeShop',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            shop: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteProductIdShopShopRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/:id/removeShop/:shop': {
    'POST': {
      handler: 'ProductController.removeShop',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            shop: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdRemoveShopShopRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.removeShop',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            shop: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdRemoveShopShopRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/collections': {
    'GET': {
      handler: 'ProductController.collections',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdCollectionsRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/:id/addVendor/:vendor': {
    'POST': {
      handler: 'ProductController.addVendor',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            vendor: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdAddVendorVendorRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addVendor',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            vendor: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdAddVendorVendorRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/vendor/:vendor': {
    'POST': {
      handler: 'ProductController.addVendor',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            vendor: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdVendorVendorRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.addVendor',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            vendor: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdVendorVendorRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'ProductController.removeVendor',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            vendor: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteProductIdVendorVendorRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/:id/removeVendor/:vendor': {
    'POST': {
      handler: 'ProductController.removeVendor',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            vendor: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdRemoveVendorVendorRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.removeVendor',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            vendor: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutProductIdRemoveVendorVendorRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/vendors': {
    'GET': {
      handler: 'ProductController.vendors',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdVendorsRoute',
            roles: ['admin', 'registered', 'public']
          }
        }
      }
    }
  },
  '/product/updateProducts': {
    'POST': {
      handler: 'ProductController.updateProducts',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostProductUpdateProductsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'ProductController.updateProducts',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPutProductUpdateProductsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/remove': {
    'POST': {
      handler: 'ProductController.removeProduct',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdRemoveRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/removeProducts': {
    'DELETE': {
      handler: 'ProductController.removeProducts',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiDeleteProductRemoveProductsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'ProductController.removeProducts',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostProductRemoveProductsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/variant': {
    'POST': {
      handler: 'ProductController.createVariant',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdVariantRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/variant/:variant/remove': {
    'POST': {
      handler: 'ProductController.removeVariant',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdVariantVariantRemoveRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/variant/:variant': {
    'POST': {
      handler: 'ProductController.updateVariant',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdVariantVariantRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'ProductController.removeVariant',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteProductIdVariantVariantRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/removeVariants': {
    'DELETE': {
      handler: 'ProductController.removeVariants',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiDeleteProductRemoveVariantsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'ProductController.removeVariants',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostProductRemoveVariantsRoute',
            roles: ['admin']
          }
        }
      }
    },
  },
  '/product/:id/image/create': {
    'POST': {
      handler: 'ProductController.createImage',
      config: {
        prefix: 'cart.prefix',
        pre: ['ProductPolicy.image'],
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdImageCreateRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/variant/:variant/image/create': {
    'POST': {
      handler: 'ProductController.createImage',
      config: {
        prefix: 'cart.prefix',
        pre: ['ProductPolicy.image'],
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            variant: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdVariantVariantImageCreateRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/image/:image/add': {
    'POST': {
      handler: 'ProductController.addImage',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            image: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdImageImageAddRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/image/:image/remove': {
    'POST': {
      handler: 'ProductController.removeImage',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            image: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdImageImageRemoveRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/image/:image': {
    'DELETE': {
      handler: 'ProductController.removeImage',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            image: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteProductIdImageImageRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/associations': {
    'GET': {
      handler: 'ProductController.associations',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdAssociationsRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    },
    'POST': {
      handler: 'ProductController.addAssociations',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdAssociationsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/variant/:id/associations': {
    'GET': {
      handler: 'ProductController.variantAssociations',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdVariantAssociationsRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    },
    'POST': {
      handler: 'ProductController.addVariantAssociations',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdVariantAssociationsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/:id/relations': {
    'GET': {
      handler: 'ProductController.relations',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdRelationsRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/product/:id/suggestions': {
    'GET': {
      handler: 'ProductController.suggestions',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdSuggestionsRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/product/:id/reviews': {
    'GET': {
      handler: 'ProductController.reviews',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdReviewsRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/product/:id/variants': {
    'GET': {
      handler: 'ProductController.variants',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdVariantsRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },

  '/product/:id/variants/search': {
    'GET': {
      handler: 'ProductController.variantsSearch',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            term: joi.string().required(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdVariantsSearchRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/product/:id/images': {
    'GET': {
      handler: 'ProductController.images',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdImagesRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/product/:id/shops': {
    'GET': {
      handler: 'ProductController.shops',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetProductIdShopsRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/product/:id/removeImages': {
    'DELETE': {
      handler: 'ProductController.removeImages',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteProductIdRemoveImagesRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'ProductController.removeImages',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductIdRemoveImagesRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/uploadCSV': {
    'POST': {
      handler: 'ProductController.uploadCSV',
      config: {
        prefix: 'cart.prefix',
        pre: ['ProductPolicy.csv'],
        app: {
          permissions: {
            resource_name: 'apiPostProductUploadCsvRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/processUpload/:id': {
    'POST': {
      handler: 'ProductController.processUpload',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            // This will only ever be a string
            id: joi.string().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductProcessUploadRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/export': {
    'POST': {
      handler: 'ProductController.exportProducts',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostProductExportRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/uploadMetaCSV': {
    'POST': {
      handler: 'ProductController.uploadMetaCSV',
      config: {
        prefix: 'cart.prefix',
        pre: ['ProductPolicy.csv'],
        app: {
          permissions: {
            resource_name: 'apiPostProductUploadMetaCsvRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/processMetaUpload/:id': {
    'POST': {
      handler: 'ProductController.processMetaUpload',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            // this will only ever be a string
            id: joi.string().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductProcessMetaUploadRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/uploadReviewCSV': {
    'POST': {
      handler: 'ProductController.uploadReviewCSV',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostProductUploadReviewCsvRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/product/processReviewUpload/:id': {
    'POST': {
      handler: 'ProductController.processReviewUpload',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            // this will only ever be a string
            id: joi.string().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostProductProcessReviewUploadRoute',
            roles: ['admin']
          }
        }
      }
    }
  },

  // Orders
  '/order': {
    'POST': {
      handler: 'OrderController.create',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostOrderRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/orders': {
    'GET': {
      handler: 'OrderController.findAll',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.object(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetOrdersRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'OrderController.create',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostOrdersRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/events/:event': {
    'GET': {
      handler: 'OrderController.event',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            event: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdEventsEventRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id': {
    'GET': {
      handler: 'OrderController.findById',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetOrderIdRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'POST': {
      handler: 'OrderController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/order/token/:token': {
    'GET': {
      handler: 'OrderController.findByToken',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            token: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetOrderTokenTokenRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/order/:id/customer': {
    'GET': {
      handler: 'OrderController.customer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetOrderIdCustomerRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/pricingOverrides': {
    'POST': {
      handler: 'OrderController.pricingOverrides',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdPricingOverridesRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.pricingOverrides',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.number().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdPricingOverridesRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/addItem': {
    'POST': {
      handler: 'OrderController.addItem',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdAddItemRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.addItem',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdAddItemRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/order/:id/addItems': {
    'POST': {
      handler: 'OrderController.addItems',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdAddItemsRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.addItems',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdAddItemsRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/order/:id/updateItem': {
    'POST': {
      handler: 'OrderController.updateItem',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdUpdateItemRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.updateItem',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdUpdateItemRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/order/:id/removeItem': {
    'POST': {
      handler: 'OrderController.removeItem',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdRemoveItemRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.removeItem',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdRemoveItemRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/order/:id/addShipping': {
    'POST': {
      handler: 'OrderController.addShipping',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdAddShippingRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.addShipping',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdAddShippingRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/removeShipping': {
    'POST': {
      handler: 'OrderController.removeShipping',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdRemoveShippingRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.removeShipping',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdRemoveShippingRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/addTaxes': {
    'POST': {
      handler: 'OrderController.addTaxes',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdAddTaxesRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.addTaxes',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdAddTaxesRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/removeTaxes': {
    'POST': {
      handler: 'OrderController.removeTaxes',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdRemoveTaxesRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.removeTaxes',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdRemoveTaxesRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/fulfill': {
    'POST': {
      handler: 'OrderController.fulfill',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdFulfillRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.fulfill',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdFulfillRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/pay': {
    'POST': {
      handler: 'OrderController.pay',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdPayRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.pay',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdPayRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/order/:id/events': {
    'GET': {
      handler: 'OrderController.events',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdEventsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/refunds': {
    'GET': {
      handler: 'OrderController.refunds',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdRefundsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/transactions': {
    'GET': {
      handler: 'OrderController.transactions',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdTransactionsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/transaction/:transaction/pay': {
    'PUT': {
      handler: 'OrderController.payTransaction',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            transaction: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdTransactionTransactionPayRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/transaction/:transaction/authorize': {
    'PUT': {
      handler: 'OrderController.authorizeTransaction',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            transaction: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdTransactionTransactionAuthorizeRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/transaction/:transaction/capture': {
    'PUT': {
      handler: 'OrderController.captureTransaction',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            transaction: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdTransactionTransactionCaptureRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/transaction/:transaction/void': {
    'PUT': {
      handler: 'OrderController.voidTransaction',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            transaction: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdTransactionTransactionVoidRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/transaction/:transaction/refund': {
    'PUT': {
      handler: 'OrderController.refundTransaction',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            transaction: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdTransactionTransactionRefundRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/transaction/:transaction/retry': {
    'PUT': {
      handler: 'OrderController.retryTransaction',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            transaction: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdTransactionTransactionRetryRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/transaction/:transaction/cancel': {
    'PUT': {
      handler: 'OrderController.cancelTransaction',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            transaction: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdTransactionTransactionCancelRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/fulfillments': {
    'GET': {
      handler: 'OrderController.fulfillments',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdFulfillmentsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/fulfillment/:fulfillment': {
    'PUT': {
      handler: 'OrderController.updateFulfillment',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            fulfillment: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdFulfillmentFulfillmentRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // TODO legacy
  '/order/:id/addTag/:tag': {
    'POST': {
      handler: 'OrderController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdAddTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdAddTagTagRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/removeTag/:tag': {
    'POST': {
      handler: 'OrderController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdRemoveTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdRemoveTagTagRoute',
            roles: ['admin']
          }
        }
      }
    }
  },

  '/order/:id/tag/:tag': {
    'POST': {
      handler: 'OrderController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.addTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdTagTagRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'OrderController.removeTag',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required(),
            tag: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteOrderTagTagRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/cancel': {
    'POST': {
      handler: 'OrderController.cancel',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdCancelRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.cancel',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdCancelRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/order/:id/authorize': {
    'POST': {
      handler: 'OrderController.authorize',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdAuthorizeRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.authorize',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdAuthorizeRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/capture': {
    'POST': {
      handler: 'OrderController.capture',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdCaptureRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.capture',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdCaptureRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/void': {
    'POST': {
      handler: 'OrderController.void',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdVoidRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.void',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdVoidRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/refund': {
    'POST': {
      handler: 'OrderController.refund',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdRefundRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.refund',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdRefundRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/retry': {
    'POST': {
      handler: 'OrderController.retry',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdRetryRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.retry',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdRetryRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/:id/send': {
    'POST': {
      handler: 'OrderController.send',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderIdSendRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'OrderController.send',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutOrderIdSendRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/generalStats': {
    'GET': {
      handler: 'OrderController.generalStats',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetOrderGeneralStatsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/count': {
    'GET': {
      handler: 'OrderController.count',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiGetOrderCountRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/search': {
    'GET': {
      handler: 'OrderController.search',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            term: joi.string().required(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetOrderSearchRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/export': {
    'POST': {
      handler: 'OrderController.exportOrders',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostOrderExportRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/uploadCSV': {
    'POST': {
      handler: 'OrderController.uploadCSV',
      config: {
        prefix: 'cart.prefix',
        pre: ['OrderPolicy.csv'],
        app: {
          permissions: {
            resource_name: 'apiPostOrderUploadCsvRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/order/processUpload/:id': {
    'POST': {
      handler: 'OrderController.processUpload',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            // this will only ever be a string
            id: joi.string().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostOrderProcessUploadRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // Reviews
  '/review': {
    'POST': {
      handler: 'ReviewController.create',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostReviewRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/reviews': {
    'GET': {
      handler: 'ReviewController.findAll',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetReviewsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/review/:id': {
    'GET': {
      handler: 'ReviewController.findById',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetReviewIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'ReviewController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostReviewIdRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    },
    'PUT': {
      handler: 'ReviewController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutReviewIdRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/review/generalStats': {
    'GET': 'ReviewController.generalStats',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetReviewGeneralStatsRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/review/count': {
    'GET': 'ReviewController.count',
    config: {
      prefix: 'cart.prefix',
      app: {
        permissions: {
          resource_name: 'apiGetReviewCountRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/reviews/search': {
    'GET': 'ReviewController.search',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any().optional(),
          term: joi.any(),
          include: joi.array().items(joi.string())
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetReviewsSearchRoute',
          roles: ['public', 'registered', 'admin']
        }
      }
    }
  },

  // Shop
  '/shops': {
    'GET': {
      handler: 'ShopController.findAll',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetShopsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/shop/generalStats': {
    'GET': 'ShopController.generalStats',
    config: {
      prefix: 'cart.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetShopGeneralStatsRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/shop/count': {
    'GET': 'ShopController.count',
    config: {
      prefix: 'cart.prefix',
      app: {
        permissions: {
          resource_name: 'apiGetShopCountRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/shop': {
    'POST': {
      handler: 'ShopController.create',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostShopRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // Subscription
  '/subscriptions': {
    'GET': {
      handler: 'SubscriptionController.findAll',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetSubscriptionsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscriptions/search': {
    'GET': {
      handler: 'SubscriptionController.search',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any().optional(),
            term: joi.string().required(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetSubscriptionsSearchRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/subscription/:id': {
    'GET': {
      handler: 'SubscriptionController.findById',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetSubscriptionIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    // TODO Deprecate
    'POST': {
      handler: 'SubscriptionController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostSubscriptionIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'SubscriptionController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutSubscriptionIdRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/token/:token': {
    'GET': {
      handler: 'SubscriptionController.findByToken',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetSubscriptionTokenTokenRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },
  '/subscription/:id/customer': {
    'GET': {
      handler: 'SubscriptionController.customer',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetSubscriptionIdCustomerRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/:id/orders': {
    'GET': {
      handler: 'SubscriptionController.orders',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetSubscriptionIdOrdersRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/:id/activate': {
    // TODO deprecate
    'POST': {
      handler: 'SubscriptionController.activate',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostSubscriptionIdActivateRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'SubscriptionController.activate',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutSubscriptionIdActivateRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/:id/deactivate': {
    // TODO Deprecate
    'POST': {
      handler: 'SubscriptionController.deactivate',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostSubscriptionIdDeactivateRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'SubscriptionController.deactivate',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutSubscriptionIdDeactivateRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/:id/renew': {
    'POST': {
      handler: 'SubscriptionController.renew',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostSubscriptionIdRenewRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'SubscriptionController.renew',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutSubscriptionIdRenewRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/:id/addItems': {
    'POST': {
      handler: 'SubscriptionController.addItems',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostSubscriptionIdAddItemsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/:id/cancel': {
    'POST': {
      handler: 'SubscriptionController.cancel',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostSubscriptionIdCancelRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'SubscriptionController.cancel',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutSubscriptionIdCancelRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/:id/removeItems': {
    'POST': {
      handler: 'SubscriptionController.removeItems',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostSubscriptionIdRemoveItemsRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'SubscriptionController.removeItems',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutSubscriptionIdRemoveItemsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/:id/events': {
    'GET': {
      handler: 'SubscriptionController.events',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetSubscriptionIdEventsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/:id/update': {
    'POST': {
      handler: 'SubscriptionController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostSubscriptionIdUpdateRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'SubscriptionController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutSubscriptionIdUpdateRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/generalStats': {
    'GET': {
      handler: 'SubscriptionController.generalStats',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetSubscriptionGeneralStatsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/count': {
    'GET': {
      handler: 'SubscriptionController.count',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiGetSubscriptionCountRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/uploadCSV': {
    'POST': {
      handler: 'SubscriptionController.uploadCSV',
      config: {
        prefix: 'cart.prefix',
        pre: ['SubscriptionPolicy.csv'],
        app: {
          permissions: {
            resource_name: 'apiPostSubscriptionUploadCsvRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/subscription/processUpload/:id': {
    'POST': {
      handler: 'SubscriptionController.processUpload',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            // this will only ever be a string
            id: joi.string().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostSubscriptionProcessUploadRoute',
            roles: ['admin']
          }
        }
      }
    }
  },

  // Tag
  '/tags': {
    'GET': {
      handler: 'TagController.findAll',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetTagsRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/tag/:id': {
    'GET': {
      handler: 'TagController.findById',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetTagIdRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/tag/name/:name': {
    'GET': {
      handler: 'TagController.findByName',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            // this will only ever be a string
            name: joi.string().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetTagNameRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  '/tag/count': {
    'GET': 'TagController.count',
    config: {
      prefix: 'cart.prefix',
      app: {
        permissions: {
          resource_name: 'apiGetTagCountRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/tag/search': {
    'GET': {
      path: '/tag/search',
      handler: 'TagController.search',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any().optional(),
            term: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetTagSearchRoute',
            roles: ['public', 'registered', 'admin']
          }
        }
      }
    }
  },
  //  Transaction
  '/transaction': {
    'POST': {
      handler: 'TransactionController.create',
      config: {
        prefix: 'cart.prefix',
        app: {
          permissions: {
            resource_name: 'apiPostTransactionRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/transaction/generalStats': {
    'GET': {
      handler: 'TransactionController.generalStats',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetTransactionGeneralStatsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/transactions': {
    'GET': {
      handler: 'TransactionController.findAll',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetTransactionsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/transaction/:id': {
    'GET': {
      path: '/transaction/:id',
      handler: 'TransactionController.findById',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetTransactionIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'POST': {
      handler: 'TransactionController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostTransactionIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'TransactionController.update',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutTransactionIdRoute',
            roles: ['admin']
          }
        }
      }
    },
    'DELETE': {
      handler: 'TransactionController.destroy',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiDeleteTransactionIdRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/transaction/:id/authorize': {
    'POST': {
      handler: 'TransactionController.authorize',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostTransactionAuthorizeRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'TransactionController.authorize',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutTransactionAuthorizeRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/transaction/:id/capture': {
    'POST': {
      handler: 'TransactionController.capture',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostTransactionIdCaptureRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'TransactionController.capture',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutTransactionIdCaptureRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/transaction/:id/retry': {
    'POST': {
      handler: 'TransactionController.retry',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostTransactionIdRetryRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'TransactionController.retry',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutTransactionIdRetryRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/transaction/:id/sale': {
    'POST': {
      handler: 'TransactionController.sale',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostTransactionIdSaleRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'TransactionController.sale',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutTransactionIdSaleRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/transaction/:id/void': {
    'POST': {
      handler: 'TransactionController.void',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostTransactionIdVoidRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'TransactionController.void',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutTransactionIdVoidRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/transaction/:id/refund': {
    'POST': {
      handler: 'TransactionController.refund',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostTransactionIdRefundRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'TransactionController.refund',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutTransactionIdRefundRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/transaction/:id/cancel': {
    'POST': {
      handler: 'TransactionController.cancel',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostTransactionIdCancelRoute',
            roles: ['admin']
          }
        }
      }
    },
    'PUT': {
      handler: 'TransactionController.cancel',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPutTransactionIdCancelRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  // User
  '/user/:id/customers': {
    'GET': {
      handler: 'UserController.customers',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetUserIdCustomersRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/user/customers': {
    'GET': {
      handler: 'UserController.customers',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetUserCustomersRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },

  '/user/:id/passports': {
    'GET': {
      handler: 'UserController.passports',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          },
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetUserIdPassportsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },

  '/user/reviews': {
    'GET': {
      handler: 'UserController.reviews',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetUserReviewsRoute',
            roles: ['admin', 'registered']
          }
        }
      }
    }
  },

  // Vendor
  '/vendors': {
    'GET': {
      handler: 'VendorController.findAll',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetVendorsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/vendors/search': {
    'GET': {
      handler: 'VendorController.search',
      config: {
        prefix: 'cart.prefix',
        validate: {
          query: {
            offset: joi.number(),
            limit: joi.number(),
            sort: joi.array().items(joi.array()),
            where: joi.any(),
            term: joi.any(),
            include: joi.array().items(joi.string())
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetVendorsSearchRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/vendor/:id/products': {
    'GET': {
      handler: 'VendorController.products',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            id: joi.alternatives().try(
              joi.number(),
              joi.string()
            ).required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiGetVendorIdProductsRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/vendor/uploadCSV': {
    'POST': {
      handler: 'VendorController.uploadCSV',
      config: {
        prefix: 'cart.prefix',
        pre: ['VendorPolicy.csv'],
        app: {
          permissions: {
            resource_name: 'apiPostVendorUploadCsvRoute',
            roles: ['admin']
          }
        }
      }
    }
  },
  '/vendor/processUpload/:id': {
    'POST': {
      handler: 'VendorController.processUpload',
      config: {
        prefix: 'cart.prefix',
        validate: {
          params: {
            // This will only ever be a sting
            id: joi.string().required()
          }
        },
        app: {
          permissions: {
            resource_name: 'apiPostVendorProcessUploadRoute',
            roles: ['admin']
          }
        }
      }
    }
  }
}
