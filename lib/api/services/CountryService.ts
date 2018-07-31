

import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'

/**
 * @module CountryService
 * @description Country Service
 */
export class CountryService extends Service {
  // TODO
  createCountry(country) {
    return Promise.resolve(country)
  }
  // TODO
  updateCountry(country) {
    return Promise.resolve(country)
  }
  // TODO
  destroyCountry(country) {
    return Promise.resolve(country)
  }
  // TODO
  createProvince(province) {
    return Promise.resolve(province)
  }
  // TODO
  updateProvince(province) {
    return Promise.resolve(province)
  }
  // TODO
  destroyProvince(province) {
    return Promise.resolve(province)
  }
  // TODO
  createCounty(county) {
    return Promise.resolve(county)
  }
  // TODO
  updateCounty(county) {
    return Promise.resolve(county)
  }
  // TODO
  destroyCounty(county) {
    return Promise.resolve(county)
  }
  // TODO
  createCity(city) {
    return Promise.resolve(city)
  }
  // TODO
  updateCity(city) {
    return Promise.resolve(city)
  }
  // TODO
  destroyCity(city) {
    return Promise.resolve(city)
  }
  /**
   *
   * @param country
   * @param province
   * @returns {Promise.<TResult>}
   */
  addProvince(country, province) {
    let resCountry, resProvince
    return this.app.models.Country.resolveCountry(country)
      .then(_country => {
        if (!_country) {
          throw new ModelError('E_NOT_FOUND', 'Country not found')
        }
        resCountry = _country
        return this.app.models.Province.resolveProvince(province)
      })
      .then(_province => {
        if (!_province) {
          throw new ModelError('E_NOT_FOUND', 'Country not found')
        }
        resProvince = _province
        return resCountry.hasProvince(resProvince.id)
      })
      .then(hasProvince => {
        if (!hasProvince) {
          return resCountry.addProvince(resProvince.id)
        }
        return resCountry
      })
      .then(_province => {
        return this.app.models['Country'].findById(resCountry.id)
      })
  }

  /**
   *
   * @param country
   * @param province
   * @returns {Promise.<TResult>}
   */
  removeProvince(country, province) {
    let resCountry, resProvince
    return this.app.models.Country.resolveCountry(country)
      .then(_country => {
        if (!_country) {
          throw new ModelError('E_NOT_FOUND', 'Country not found')
        }
        resCountry = _country
        return this.app.models.Province.resolveProvince(province)
      })
      .then(_province => {
        if (!_province) {
          throw new ModelError('E_NOT_FOUND', 'Country not found')
        }
        resProvince = _province
        return resCountry.hasProvince(resProvince.id)
      })
      .then(hasProvince => {
        if (hasProvince) {
          return resCountry.removeProvince(resProvince.id)
        }
        return resCountry
      })
      .then(_province => {
        return this.app.models['Country'].findById(resCountry.id)
      })
  }
}

