
import * as joi from 'joi'
import { variant } from './variant'

export const removeVariants = joi.array().items(variant)
