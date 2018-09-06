import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module OrderRisk
 * @description Order Risk
 */
export class OrderRisk extends Model {

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
    return {
      order_id: {
        type: Sequelize.INTEGER
      },
      reason: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('cart.live_mode')
      }
    }
  }
}
