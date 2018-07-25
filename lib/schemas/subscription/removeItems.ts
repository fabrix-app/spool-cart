
import * as joi from 'joi'
import { line_item } from './line_item'
export const removeItems =  joi.alternatives().try(
  joi.object().keys({
    line_items: joi.array().items(line_item)
  }).unknown(),
  joi.array().items(line_item)
)
