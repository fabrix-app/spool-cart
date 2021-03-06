import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

import { INVENTORY_POLICY } from '../../enums'

/**
 * @module ShopProduct
 * @description Shop Product
 */
export class ShopProduct extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          INVENTORY_POLICY: INVENTORY_POLICY
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
      product_id: {
        type: Sequelize.INTEGER,
        unique: 'shopproduct_variant'
      },
      variant_id: {
        type: Sequelize.INTEGER,
        unique: 'shopproduct_variant'
      },
      shop_id: {
        type: Sequelize.INTEGER,
        unique: 'shopproduct_variant',
        references: null
      },
      // Specifies whether or not Proxy Cart tracks the number of items in stock for this product variant.
      inventory_management: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // Specifies whether or not customers are allowed to place an order for a product variant when it's out of stock.
      inventory_policy: {
        type: Sequelize.ENUM,
        values: Object.values(INVENTORY_POLICY),
        defaultValue: INVENTORY_POLICY.DENY
      },
      // Amount of variant in inventory
      inventory_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // The average amount of days to come in stock if out of stock
      inventory_lead_time: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    }
  }
}
