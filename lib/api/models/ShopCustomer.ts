import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'


/**
 * @module ShopCustomer
 * @description Shop Customer
 */
export class ShopCustomer extends Model {

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
      customer_id: {
        type: Sequelize.INTEGER,
        unique: 'shopcustomer_customer'
      },
      shop_id: {
        type: Sequelize.INTEGER,
        unique: 'shopcustomer_customer',
        references: null
      }
    }
  }
}
