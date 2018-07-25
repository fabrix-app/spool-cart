
import * as joi from 'joi'
import { shipping } from './shipping'
export const removeShipping = joi.alternatives().try(
  shipping,
  joi.array().items(shipping)
)
