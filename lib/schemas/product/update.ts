

import * as joi from 'joi'
import { product } from './product'
export const update = joi.array().items(product)
