
import * as joi from 'joi'

export const refund = joi.array().items(joi.object().keys({
  transaction: joi.any(),
  amount: joi.number()
}))
