
import * as joi from 'joi'

export const association = joi.object().keys({
  product_id: joi.alternatives().try(
    joi.number(),
    joi.string()
  ),
  variant_id: joi.alternatives().try(
    joi.number(),
    joi.string(),
  ),
  product_variant_id: joi.alternatives().try(
    joi.number(),
    joi.string(),
  ),
  position: joi.number()
})
