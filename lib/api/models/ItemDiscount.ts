import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { values } from 'lodash'

import { DISCOUNT_MODELS } from '../../enums'

/**
 * @module ItemDiscount
 * @description Item Discount
 */
export class ItemDiscount extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          DISCOUNT_MODELS: DISCOUNT_MODELS
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
      discount_id: {
        type: Sequelize.INTEGER,
        unique: 'discount_model',
        // references: {
        //   model: app.models['Discount'],
        //   key: 'id'
        // }
      },
      model: {
        type: Sequelize.ENUM,
        unique: 'discount_model',
        values: values(DISCOUNT_MODELS)
      },
      model_id: {
        type: Sequelize.INTEGER,
        unique: 'discount_model',
        references: null
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    // TODO, fix the foreign constraint so that this works again
    // models.ItemDiscount.belongsTo(models.Discount, {
    //   foreignKey: 'discount_id'
    // })
  }
}
