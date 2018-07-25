
import * as joi from 'joi'
import { product } from './product'

export const add =  joi.array().items(product)
