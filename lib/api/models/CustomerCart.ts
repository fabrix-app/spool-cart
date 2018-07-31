import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module CustomerCart
 * @description Customer Cart Model n:m
 */
export class CustomerCart extends Model {
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
      cart_id: {
        type: Sequelize.INTEGER,
        unique: 'customercart_cart'
      },
      cart: {
        type: Sequelize.STRING,
        unique: 'customercart_cart'
      },
      customer_id: {
        type: Sequelize.INTEGER,
        unique: 'customercart_cart',
        references: null
      }
    }
  }
}
