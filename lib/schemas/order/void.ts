
import * as joi from 'joi'

export const voidTransaction = joi.array().items(joi.object().keys({
  transaction: joi.any()
}))
