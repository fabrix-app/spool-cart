import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module County
 * @description County Model
 */
export class County extends Model {

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
        }
      }
    }
  }

  static schema (app, Sequelize) {
    const schema = {
      name: {
        type: Sequelize.STRING
      },
      tax_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      tax_percentage: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      tax_type: {
        type: Sequelize.STRING
      },
      tax_name: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('engine.live_mode')
      }
    }
    return schema
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate(models) {
    models.County.belongsTo(models.Province, {
      // as: 'country_id'
    })
    models.County.hasMany(models.City, {
      as: 'cities'
    })
    models.County.belongsTo(models.Country, {
      // as: 'country_id'
    })
  }
}
