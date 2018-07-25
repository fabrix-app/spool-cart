import { SequelizeResolver } from '@fabrix/spool-sequelize'

import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'

/**
 * @module OrderSource
 * @description Order Source Many to Many
 */
export class OrderSource extends Model {

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
      source_id: {
        type: Sequelize.INTEGER,
        unique: 'orderssource_source'
      },
      order_id: {
        type: Sequelize.INTEGER,
        unique: 'orderssource_source',
        references: null
      }
    }
  }
}
