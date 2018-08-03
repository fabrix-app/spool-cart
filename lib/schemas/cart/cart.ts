
import * as joi from 'joi'
import { lineItem } from './lineItem'
import { address } from '../address/address'

export const cart = joi.object().keys({
  line_items: joi.array().items(lineItem),
  customer_id: joi.number(),
  client_details: joi.object(),
  ip: joi.string(),
  host: joi.string(),
  shop_id: joi.number(),
  shipping_address: address.optional(),
  billing_address: address.optional(),
  notes: joi.string()
}).unknown()
