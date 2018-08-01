import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module CustomerAddress
 * @description Customer Address Model
 */
export class ItemAddress extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        indexes: [
          {
            fields: ['address_id', 'model', 'model_id', 'address']
          }
        ],
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
      address_id: {
        type: Sequelize.INTEGER,
        // unique: 'itemaddress_address'
      },
      model: {
        type: Sequelize.STRING,
        // unique: 'itemaddress_address'
      },
      model_id: {
        type: Sequelize.INTEGER,
        // unique: 'itemaddress_address',
        references: null
      },
      address: {
        type: Sequelize.STRING,
        defaultValue: 'address',
        // unique: 'itemaddress_address'
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.ItemAddress.belongsTo(models.Address, {
      foreignKey: 'address_id'
    })
  }
}
