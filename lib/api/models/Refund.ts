import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module Refund
 * @description Refund Model
 */
export class Refund extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        scopes: {
          live: {
            where: {
              live_mode: true
            }
          }
        },
        hooks: {
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      order_id: {
        type: Sequelize.INTEGER
      },
      transaction_id: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The time at which the refund was processed
      processed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      // refund_order_items: helpers.ARRAY('Refund', app, Sequelize, Sequelize.JSONB, 'refund_order_items', {
      //   defaultValue: []
      // }),
      restock: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('cart.refund_restock')
      },
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('engine.live_mode')
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.Refund.belongsTo(models.Order, {
      // as: 'order_id'
    })
    models.Refund.belongsTo(models.Transaction, {
      // as: 'order_id'
    })
    models.Refund.belongsToMany(models.OrderItem, {
      as: 'order_items',
      through: {
        model: models.ItemRefund,
        unique: false,
        scope: {
          model: 'order_item'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })
    models.Refund.belongsToMany(models.Transaction, {
      as: 'transactions',
      through: {
        model: models.ItemRefund,
        unique: false,
        scope: {
          model: 'transaction'
        }
      },
      foreignKey: 'model_id',
      constraints: false
    })
  }
}
