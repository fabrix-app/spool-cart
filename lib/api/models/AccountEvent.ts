import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { values } from 'lodash'
import { ACCOUNT_EVENT_TYPE } from '../../enums'
/**
 * @module AccountEvent
 * @description Saves Account Balance updates to accounts/customer

 */
export class AccountEvent extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          ACCOUNT_EVENT_TYPE: ACCOUNT_EVENT_TYPE
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // The account for the event
      account_id: {
        type: Sequelize.INTEGER
      },
      // The customer for the event
      customer_id: {
        type: Sequelize.INTEGER
      },
      // The order for the event
      order_id: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM,
        values: values(ACCOUNT_EVENT_TYPE),
      },
      // The amount of the credit or debit
      price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate(models) {
    models.AccountEvent.belongsTo(models.Account, {
      foreignKey: 'account_id'
    })

    models.AccountEvent.belongsTo(models.Customer, {
      foreignKey: 'customer_id'
    })

    models.AccountEvent.belongsTo(models.Order, {
      foreignKey: 'order_id'
    })
  }
}
