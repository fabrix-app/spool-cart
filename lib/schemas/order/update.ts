
import * as joi from 'joi'
import { address } from '../address/address'

export const update = joi.object().keys({
  buyer_accepts_marketing: joi.boolean(),
  shipping_address: address,
  billing_address: address,
  email: joi.string(),
  note: joi.string()
}).unknown()
