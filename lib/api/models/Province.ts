import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module Province
 * @description Province Model
 */
export class Province extends Model {

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
    return {
      code: {
        type: Sequelize.STRING
      },
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
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.Province.belongsTo(models.Country, {
      // as: 'country_id'
    })
    models.Province.hasMany(models.County, {
      as: 'counties'
    })
    models.Province.belongsToMany(models.ShippingZone, {
      through: {
        model: models.ItemShippingZone,
        unique: false,
        scope: {
          model: 'province'
        }
      },
      foreignKey: 'shipping_zone_id',
      constraints: false
    })
  }
}
