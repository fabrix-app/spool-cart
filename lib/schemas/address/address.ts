
import * as joi from 'joi'

export const address = joi.object().keys({
  address_1: joi.string(),
  address_2: joi.string().allow('', null).optional(),
  address_3: joi.string().allow('', null).optional(),
  company: joi.string().allow('', null).optional(),
  city: joi.string(),
  prefix: joi.string().allow('', null).optional(),
  first_name: joi.string().allow('', null).optional(),
  last_name: joi.string().allow('', null).optional(),
  suffix: joi.string().allow('', null).optional(),
  phone: joi.string().allow('', null).optional(),
  province: joi.string(),
  province_code: joi.string(),
  country: joi.string(),
  country_code: joi.string(),
  country_name: joi.string(),
  postal_code: joi.string()
}).unknown()
