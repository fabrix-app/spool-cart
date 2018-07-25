
import * as joi from 'joi'

export const storeConfig = joi.object().keys({
  orm: joi.string(),
  // models: joi.object().keys({
  //   defaultStore: joi.string().required(),
  //   migrate: joi.string()
  // }),
  // stores: joi.object().keys({
  //   // uploads: joi.object().required()
  // }).unknown()
})
