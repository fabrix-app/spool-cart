
import * as joi from 'joi'
import { collection } from './collection'
export const collections = joi.array().items(collection)
