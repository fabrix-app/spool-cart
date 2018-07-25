import * as joi from 'joi'

export const cartSpoolMiddleware = joi.object().keys({
  order: joi.array().items(joi.string(), joi.string().label('cartInit', 'cartSession', 'cartSessionCart', 'cartSessionCustomer').required())
}).unknown()
