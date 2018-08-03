import * as joi from 'joi'
import { country, province, county, city } from '../schemas/country'

export const validateCountry = {
  // Validate Create Country
  createCountry(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, country, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Update Country
  updateCountry(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, country, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Destroy Country
  destroyCountry(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, country, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Create Province
  createProvince(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, province, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Update Province
  updateProvince(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, province, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Destroy Province
  destroyProvince(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, province, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Create County
  createCounty(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, county, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Update County
  updateCounty(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, county, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Destroy County
  destroyCounty(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, county, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Create City
  createCity(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, city, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Update City
  updateCity(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, city, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  },
  // Validate Destroy City
  destroyCity(data) {
    return new Promise((resolve, reject) => {
      joi.validate(data, city, (err, value) => {
        if (err) {
          return reject(new TypeError(err))
        }
        return resolve(value)
      })
    })
  }
}
