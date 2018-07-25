
import * as joi from 'joi'

export const retry = joi.array().items(joi.object().keys({
  transaction: joi.alternatives().try(
    joi.number(),
    joi.string()
  ),
  amount: joi.number()
}))
