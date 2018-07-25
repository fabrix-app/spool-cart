
import * as joi from 'joi'
import { source } from './source'
export const sources = joi.array().items(source)
