
import * as joi from 'joi'
import { tag } from './tag'
export const tags = joi.array().items(tag)
