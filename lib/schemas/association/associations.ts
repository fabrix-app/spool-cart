
import * as joi from 'joi'
import { association } from './association'

export const associations = joi.array().items(association)
