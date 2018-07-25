

import { FabrixPolicy as Policy } from '@fabrix/fabrix/dist/common'
const multer = require('multer')
/**
 * @module ProductPolicy
 * @description Product Policy
 */
export class ProductPolicy extends Policy {
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  image(req, res, next) {
    const upload = multer({dest: 'test/uploads/'})
    upload.single('file')(req, res, err => {
      if (err) {
        this.log.info(err)
      }
      next()
    })
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
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

