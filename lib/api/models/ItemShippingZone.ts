import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

const SHIPPING_MODELS = require('../../lib').Enums.SHIPPING_MODELS
const _ = require('lodash')
/**
 * @module ItemShippingZone
 * @description Country and Province Shipping Zone
 */
export class ItemShippingZone extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app,Sequelize) {
    return {
      options: {
        underscored: true
      },
      classMethods: {
        SHIPPING_MODELS: SHIPPING_MODELS
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
      shipping_zone_id: {
        type: Sequelize.INTEGER,
        unique: 'shipping_zone_model',
        notNull: true
      },
      model: {
        type: Sequelize.ENUM,
        unique: 'shipping_zone_model',
        values: _.values(SHIPPING_MODELS)
      },
      model_id: {
        type: Sequelize.INTEGER,
        unique: 'shipping_zone_model',
        notNull: true,
        references: null
      }
    }
  }
}
