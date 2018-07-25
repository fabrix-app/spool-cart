
import * as joi from 'joi'
import { address } from '../address/address'
import { cart } from '../cart/cart'
import { tags } from '../tag/tags'
import { metadata } from '../metadata/metadata'

export const customer = joi.object().keys({
  id: joi.any(),
  accepts_marketing: joi.boolean(),
  first_name: joi.string(),
  last_name: joi.string(),
  email: joi.string(),
  phone: joi.string(),
  company: joi.string(),
  note: joi.string(),
  cart: joi.any(),
  default_cart: cart,
  default_address: address,
  shipping_address: address,
  billing_address: address,
  metadata: metadata,
  tags: tags,

  // Policy Arguments
  client_details: joi.object(),
  ip: joi.string(),
  host: joi.string()
})
