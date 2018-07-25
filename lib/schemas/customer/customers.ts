
import * as joi from 'joi'
import { customer } from './customer'
export const customers = joi.array().items(customer)
