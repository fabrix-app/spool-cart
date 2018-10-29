
import * as joi from 'joi'
import { image } from './image'

export const variant =  joi.object().keys({
  id: joi.any(),
  sku: joi.string(),
  title: joi.string(),
  price: joi.number(),
  product_id: joi.number(),
  compare_at_price: joi.number(),
  currency: joi.string(),
  collection: joi.any(),
  fulfillment_service: joi.string(),
  option: joi.object(),
  property_pricing: joi.object().pattern(
    /[\s\S]*/,
    joi.object().keys({
      name: joi.string().required(),
      group: joi.string(),
      price: joi.number().required(),
      image: joi.string(),
      multi_select: joi.boolean()
    })
  ),
  published: joi.boolean(),
  published_scope: joi.string(),
  requires_shipping: joi.boolean(),
  requires_tax: joi.boolean(),
  requires_subscription: joi.boolean(),
  subscription_interval: joi.number(),
  subscription_unit: joi.string().valid('0', 'd', 'w', 'ww', 'm', 'mm', 'y', 'yy'),
  inventory_management: joi.boolean(),
  inventory_quantity: joi.number(),
  images: joi.array().items(image),
  tax_code: joi.string(),
  weight: joi.number(),
  weight_unit: joi.string().valid('g', 'kg', 'oz', 'lb')
})
