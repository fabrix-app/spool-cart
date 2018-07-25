import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module CustomerOrder
 * @description Customer Order
 */
export class CustomerOrder extends Model {

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
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: {
        type: Sequelize.INTEGER,
        unique: 'customerorder_order'
      },
      // order: {
      //   type: Sequelize.STRING,
      //   unique: 'customerorder_order'
      // },
      customer_id: {
        type: Sequelize.INTEGER,
        unique: 'customerorder_order',
        references: null
      }
    }
  }
}
