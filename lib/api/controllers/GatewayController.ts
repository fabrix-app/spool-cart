


import { FabrixController as Controller } from '@fabrix/fabrix/dist/common'
// import { ModelError } from '@fabrix/spool-sequelize/dist/errors'
// import * as Validator from '../../validator'

/**
 * @module CartController
 * @description Cart Controller.
 */
// TODO lock down certain requests by Owner(s)
export class GatewayController extends Controller {
  /**
   *
   * @param req
   * @param res
   */
  gateways(req, res) {
    const gateways = Object.keys(this.app.config.get('generics'))
      .map(key => {
        return this.app.config.get(`generics.${key}`)
      }).filter(generic => generic.type === 'payment_processor')

    const opts = gateways.map(gate => {
      return {
        name: gate.name || 'Default',
        public: gate.config && gate.config.public ? gate.config.public : null
      }
    })

    res.json(opts)
  }
}
