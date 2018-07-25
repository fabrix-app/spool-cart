
import * as joi from 'joi'

export const association = joi.object().keys({
  product_id: joi.any(),
  handle: joi.string(),
  variant_id: joi.any(),
  position: joi.number()
})
