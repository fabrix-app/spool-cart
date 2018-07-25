
import * as joi from 'joi'
import { lineItem } from './lineItem'
export const removeItems =  joi.alternatives().try(
  joi.object().keys({
    line_items: joi.array().items(lineItem)
  }).unknown(),
  joi.array().items(lineItem)
)
