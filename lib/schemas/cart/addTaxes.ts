import * as joi from 'joi'
import { taxes } from './taxes'

export const addTaxes = joi.alternatives().try(
  taxes,
  joi.array().items(taxes)
)
