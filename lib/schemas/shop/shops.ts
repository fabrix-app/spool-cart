
import * as joi from 'joi'
import { shop } from './shop'
export const shops = joi.array().items(shop)
