import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { values } from 'lodash'

import { REFUND_MODELS } from '../../enums'

/**
 * @module ItemRefund
 * @description Item Refund
 */
export class ItemRefund extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          REFUND_MODELS: REFUND_MODELS
        },
        classMethods: {

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
      refund_id: {
        type: Sequelize.INTEGER,
        unique: 'item_refund',
        notNull: true
      },
      model: {
        type: Sequelize.ENUM,
        unique: 'item_refund',
        notNull: true,
        values: values(REFUND_MODELS)
      },
      model_id: {
        type: Sequelize.STRING,
        unique: 'item_refund',
        references: null,
        notNull: true
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.ItemRefund.belongsTo(models.Refund, {
      foreignKey: 'refund_id'
    })
    // models.ItemRefund.belongsTo(models.Transaction, {
    //   foreignKey: 'transaction_id'
    // })
    // models.ItemRefund.belongsTo(models.OrderItem, {
    //   foreignKey: 'order_item_id'
    // })
  }
}
