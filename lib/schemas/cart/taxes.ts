
import * as joi from 'joi'
export const taxes =  joi.object().keys({
  order_id: joi.number().optional(),
  order_item_id: joi.number().optional(),
  name: joi.string().required(),
  price: joi.number().required()
})
