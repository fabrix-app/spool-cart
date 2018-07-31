import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module CustomerAccount
 * @description Customer Account
 */
export class CustomerAccount extends Model {
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
      account_id: {
        type: Sequelize.INTEGER,
        unique: 'customeraccount_account'
      },
      customer_id: {
        type: Sequelize.INTEGER,
        unique: 'customeraccount_account',
        references: null
      }
    }
  }
}
