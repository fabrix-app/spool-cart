import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module Country
 * @description Country Model
 */
export class Country extends Model {

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
        classMethods: {
          resolve: function(country, options) {
            //
          }
        }
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      // Country Code iso-alpha-2
      code: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      tax_name: {
        type: Sequelize.STRING
      },
      tax_type: {
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
    models.Country.hasMany(models.Province, {
      as: 'provinces'
    })
    models.Country.belongsToMany(models.ShippingZone, {
      through: {
        model: models.ItemShippingZone,
        unique: false,
        scope: {
          model: 'country'
        }
      },
      foreignKey: 'shipping_zone_id',
      constraints: false
    })
  }
}
