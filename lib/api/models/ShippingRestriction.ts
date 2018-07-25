import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module ShippingRestriction
 * @description ShippingRestriction Model
 */
export class ShippingRestriction extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true
      }
    }
  }

  static schema (app, Sequelize) {
    return {}
  }
}
