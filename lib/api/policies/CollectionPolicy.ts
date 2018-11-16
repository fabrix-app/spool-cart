import { FabrixPolicy as Policy } from '@fabrix/fabrix/dist/common'
import * as multer from 'multer'

/**
 * @module CollectionPolicy
 * @description Collection Policy
 */
export class CollectionPolicy extends Policy {
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

