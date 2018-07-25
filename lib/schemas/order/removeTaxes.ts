
import * as joi from 'joi'
import { taxes } from './taxes'

export const removeTaxes = joi.alternatives().try(
  taxes,
  joi.array().items(taxes)
)
