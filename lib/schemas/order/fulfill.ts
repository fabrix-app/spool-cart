
import * as joi from 'joi'
import { fulfillment } from './fulfillment'

export const fulfill = joi.alternatives().try(
  fulfillment,
  joi.array().items(fulfillment)
)
