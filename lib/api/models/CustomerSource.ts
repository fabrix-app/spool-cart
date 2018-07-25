import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module CustomerSource
 * @description Customer Source
 */
export class CustomerSource extends Model {

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
        unique: 'customersource_source'
      },
      source: {
        type: Sequelize.STRING,
        unique: 'customersource_source'
      },
      account_id: {
        type: Sequelize.INTEGER,
        unique: 'customersource_source',
        references: null
      },
      customer_id: {
        type: Sequelize.INTEGER,
        unique: 'customersource_source',
        references: null
      }
    }
  }
}
