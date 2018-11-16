
import * as joi from 'joi'
import { address } from '../address/address'

export const shop = joi.object().keys({
  address: address,
  currency: joi.string(),
  host: joi.string(),
  handle: joi.string(),
  name: joi.string(),
  phone: joi.string(),
  primary_locale: joi.string(),
  email: joi.string(),
  money_format: joi.string(),
  money_with_currency_format: joi.string(),
  tax_shipping: joi.string(),
  taxes_included: joi.string(),
  county_taxes: joi.string(),
  timezone: joi.string(),
  iana_timezone: joi.string(),
  weight_unit: joi.string()
})
