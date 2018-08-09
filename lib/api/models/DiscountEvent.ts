import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module CustomerAccount
 * @description Customer Account
 */
export class DiscountEvent extends Model {

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
      discount_id: {
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
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
  public static associate (models) {
    models.DiscountEvent.belongsTo(models.Discount, {
      foreignKey: 'discount_id'
    })

    models.DiscountEvent.belongsTo(models.Customer, {
      foreignKey: 'customer_id'
    })

    models.DiscountEvent.belongsTo(models.Order, {
      foreignKey: 'order_id'
    })
  }
}
