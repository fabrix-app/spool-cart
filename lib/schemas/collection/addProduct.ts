
import * as joi from 'joi'
export const addProduct = joi.object().keys({
  product_position: joi.number()
})
