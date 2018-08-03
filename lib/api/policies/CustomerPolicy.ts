import { FabrixPolicy as Policy } from '@fabrix/fabrix/dist/common'
import * as multer from 'multer'

/**
 * @module CustomerPolicy
 * @description Customer Policy
 */
export class CustomerPolicy extends Policy {
  session(req, res, next) {
    // console.log('Customer Policy', req.customer)
    let err
    if (!req.customer) {
      err = new Error('session requires a customer')
    }
    next(err)
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

