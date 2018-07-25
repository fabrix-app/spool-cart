
import * as joi from 'joi'
export const image =  joi.object().keys({
  id: joi.any(),
  attachment: joi.string(), // Buffer
  src: joi.string(),
  alt: joi.string(),
  position: joi.number()
})
