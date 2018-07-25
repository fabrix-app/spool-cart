
import * as joi from 'joi'
export const line_item =  joi.object().keys({
  product_id: joi.number(),
  variant_id: joi.number(),
  product_variant_id: joi.number(),
  quantity: joi.number(),
  properties: joi.array().items(joi.object().keys({
    name: joi.string().required(),
    value: joi.string()
  })).optional()
})
