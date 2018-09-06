import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module ShippingZone
 * @description Shipping Zone Model
 */
export class ShippingZone extends Model {

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
      //
      name: {
        type: Sequelize.STRING,
        notNull: true
      },
      //
      carrier_shipping_rate_providers: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('ShippingZone', app, Sequelize, 'carrier_shipping_rate_providers', {
      //   defaultValue: []
      // }),
      //
      price_based_shipping_rates: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('ShippingZone', app, Sequelize, 'price_based_shipping_rates', {
      //   defaultValue: []
      // }),
      //
      weight_based_shipping_rates: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      //   helpers.JSONB('ShippingZone', app, Sequelize, 'weight_based_shipping_rates', {
      //   defaultValue: []
      // }),
      // Live Mode
      live_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: app.config.get('cart.live_mode')
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    // models.ShippingZone.hasMany(models.Province, {
    //   as: 'provinces'
    // })
    // models.ShippingZone.hasMany(models.Country, {
    //   as: 'country'
    // })
  }
}
