import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'


/**
 * @module ShopUser
 * @description Shop User
 */
export class ShopUser extends Model {

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
      user_id: {
        type: Sequelize.INTEGER,
        unique: 'shopuser_user'
      },
      shop_id: {
        type: Sequelize.INTEGER,
        unique: 'shopuser_user',
        references: null
      }
    }
  }
}
