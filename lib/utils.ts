
export const Utils = {
  /**
   *
   * @param app
   * @returns {Promise.<{shops: Array}>}
   */
  buildShopFixtures: (app) => {
    const fixtures = {
      shops: []
    }
    fixtures.shops.push(app.config.proxyCart.nexus)
    // console.log('utils.buildShopFixtures', fixtures)
    return Promise.resolve(fixtures)
  },
  /**
   *
   * @param app
   * @returns {*|Promise.<TResult>}
   */
  loadShopFixtures: (app) => {
    return app.models.Shop.find({limit: 1})
      .then(shops => {
        if (!shops || shops.length === 0) {
          app.log.debug('utils.loadShopFixtures: Shops empty, loadShops...')
          return Utils.loadShops(app)
        }
        else {
          return
        }
      })
  },
  /**
   *
   * @param app
   * @returns {Promise.<*>}
   */
  loadShops: (app) => {
    const shops = app.spools['cart'].shopFixtures.shops
    if (shops.length > 0) {
      app.log.debug('utils.loadShops Promise All()')
      return Promise.all(shops.map(shop => {
        return app.models['Shop'].create(shop, {
          include: [
            {
              model: app.models['Address'],
              as: 'address'
            }
          ]
        })
      }))
    }
    else {
      return Promise.resolve()
    }
  },
  /**
   *
   * @param app
   */
  buildCountryFixtures: (app) => {
    const fixtures = {
      countries: []
    }
    if (!app.config.proxyCart.default_countries || app.config.proxyCart.default_countries.length === 0) {
      app.config.proxyCart.default_countries = ['USA']
    }
    app.config.proxyCart.default_countries.forEach(country => {
      fixtures.countries.push(country)
    })
    // console.log('utils.buildShopFixtures', fixtures)
    return Promise.resolve(fixtures)
  },
  /**
   *
   * @param app
   * @returns {*|Promise.<TResult>}
   */
  loadCountryFixtures: (app) => {
    return app.models.Country.find({limit: 1})
      .then(countries => {
        if (!countries || countries.length === 0) {
          app.log.debug('utils.loadCountriesFixtures: Countries empty, loadCountries...')
          return Utils.loadCountries(app)
        }
        else {
          return
        }
      })
  },
  /**
   *
   * @param app
   * @returns {Promise.<*>}
   */
  loadCountries: (app) => {
    const countries = app.spools['cart'].countryFixtures.countries
    if (countries.length > 0) {
      app.log.debug('utils.loadCountries Promise All()')
      return Promise.all(countries.map((country, index) => {
        const resCountry = app.services.ProxyCountryService.info(country)
        if (!resCountry) {
          return Promise.resolve()
        }
        const create = {
          code: resCountry.ISO.alpha2,
          name: resCountry.name,
          tax_name: resCountry.tax_name,
          tax_type: resCountry.tax_type,
          position: index + 1,
          provinces: []
        }
        if (resCountry.tax_type === 'rate') {
          create.tax_rate = resCountry.tax
        }
        else {
          create.tax_percentage = resCountry.tax
        }

        resCountry.states.forEach((state, i) => {
          const newState = {
            code: state.code,
            name: state.name,
            tax_name: state.tax_name,
            tax_type: state.tax_type,
            position: i + 1
          }
          if (state.tax_type === 'rate') {
            newState.tax_rate = state.tax
          }
          else {
            newState.tax_percentage = state.tax
          }
          create.provinces.push(newState)
        })
        return app.models['Country'].create(create, {
          include: [
            {
              model: app.models['Province'],
              as: 'provinces'
            }
          ]
        })
      }))
    }
    else {
      return Promise.resolve()
    }
  }
}
