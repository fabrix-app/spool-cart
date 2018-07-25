
import * as joi from 'joi'
import { product } from './product'

export const remove =  joi.array().items(product)
