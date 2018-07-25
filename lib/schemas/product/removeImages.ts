
import * as joi from 'joi'
import { image } from './image'

export const removeImages =  joi.array().items(image)
