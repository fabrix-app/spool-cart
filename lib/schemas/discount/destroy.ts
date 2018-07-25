
import * as joi from 'joi'
export const destroy = joi.alternatives().try(
  joi.number(),
  joi.string()
)
