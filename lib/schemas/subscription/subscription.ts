
import * as joi from 'joi'
import { line_item } from './line_item'
export const subscription = joi.object().keys({
  id: joi.number(),
  token: joi.string(),
  line_items: joi.array().items(line_item),
  client_details: joi.object(),
  ip: joi.string(),
  host: joi.string(),
  renewed_at: joi.string(),
  active: joi.boolean(),
  interval: joi.number(),
  unit: joi.string().valid('0', 'd', 'w', 'ww', 'm', 'mm', 'y', 'yy')
})
