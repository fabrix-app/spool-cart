
import * as joi from 'joi'

export const cancel = joi.object().keys({
  id: joi.any(),
  reason: joi.string().valid('customer', 'fraud', 'inventory', 'other')
})
