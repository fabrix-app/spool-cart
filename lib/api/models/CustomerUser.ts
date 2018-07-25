import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module CustomerUser
 * @description Customer User Many to Many
 */
export class CustomerUser extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
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
      role: {
        type: Sequelize.STRING,
        defaultValue: 'admin'
      },
      user_id: {
        type: Sequelize.INTEGER,
        unique: 'customeruser_user'
      },
      customer_id: {
        type: Sequelize.INTEGER,
        unique: 'customeruser_user',
        references: null
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.CustomerUser.belongsTo(models.Customer, {
      foreignKey: 'customer_id'
    })
    models.CustomerUser.belongsTo(models.User, {
      foreignKey: 'user_id'
    })
  }
}
