

import { FabrixPolicy as Policy } from '@fabrix/fabrix/dist/common'
const multer = require('multer')

/**
 * @module CollectionPolicy
 * @description Collection Policy
 */
export class CollectionPolicy extends Policy {
  csv(req, res, next) {
    const upload = multer({dest: 'test/uploads/'})
    upload.single('file')(req, res, err => {
      if (err) {
        this.log.info(err)
      }
      next()
    })
  }
}

