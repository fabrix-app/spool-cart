import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

const CUSTOMER_MODELS = require('../../lib').Enums.CUSTOMER_MODELS
const _ = require('lodash')
/**
 * @module ItemCustomer
 * @description Item Customer Model n:m
 */
export class ItemCustomer extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app,Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          CUSTOMER_MODELS: CUSTOMER_MODELS
        },
        indexes: [
          {
            fields: ['customer_id', 'model', 'model_id', 'position']
          }
        ],
        classMethods: {
        }
      }
    }
  }

  static schema (app,Sequelize) {
    return {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customer_id: {
        type: Sequelize.INTEGER,
        unique: 'customer_model',
        notNull: true
      },
      model: {
        type: Sequelize.ENUM,
        unique: 'customer_model',
        values: _.values(CUSTOMER_MODELS)
      },
      model_id: {
        type: Sequelize.INTEGER,
        unique: 'customer_model',
        notNull: true,
        references: null
      },
      position: {
        type: Sequelize.INTEGER
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.ItemCustomer.belongsTo(models.Customer, {
      foreignKey: 'customer_id'
    })
  }
}
