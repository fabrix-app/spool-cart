
import * as joi from 'joi'
import { ORDER_CANCEL } from '../../enums'

export const cancel = joi.object().keys({
  cancel_reason: joi.string().allow().valid(Object.values(ORDER_CANCEL))
})
