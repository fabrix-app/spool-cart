
import * as joi from 'joi'
// const itemSchema } from ''./line_item')
export const pricingOverrides = joi.alternatives().try(
  joi.array().items(joi.object({
    name: joi.string(),
    price: joi.number().required()
  })).optional(),
  joi.object().keys({
    id: joi.number(),
    pricing_overrides: joi.array().items(joi.object({
      name: joi.string(),
      price: joi.number().required()
    })).optional()
  })
)
