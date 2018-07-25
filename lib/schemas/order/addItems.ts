
import * as joi from 'joi'
import { addItem } from './addItem'
export const addItems =  joi.alternatives().try(
  joi.object().keys({
    order_items: joi.array().items(addItem)
  }).unknown(),
  joi.array().items(addItem)
)
