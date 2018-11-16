import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'


/**
 * @module ShopOrder
 * @description Shop Order
 */
export class ShopOrder extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
        }
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
        unique: 'shoporder_order'
      },
      shop_id: {
        type: Sequelize.INTEGER,
        unique: 'shoporder_order',
        references: null
      }
    }
  }
}
