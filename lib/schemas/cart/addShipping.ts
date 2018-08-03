import * as joi from 'joi'
import { shipping } from './shipping'

export const addShipping = joi.alternatives().try(
  shipping,
  joi.array().items(shipping)
)
