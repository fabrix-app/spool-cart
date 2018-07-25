
import * as joi from 'joi'

export const accountBalance = joi.object().keys({
  id: joi.any(),
  account_balance: joi.number()
})
