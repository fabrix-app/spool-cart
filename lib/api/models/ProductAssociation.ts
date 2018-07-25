import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

/**
 * @module ProductAssociation
 * @description Product Association
 */
export class ProductAssociation extends Model {

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
      product_id: {
        type: Sequelize.INTEGER,
        unique: 'productassociation_association'
      },
      associated_product_id: {
        type: Sequelize.STRING,
        unique: 'productassociation_association',
        references: null
      },
      variant_id: {
        type: Sequelize.INTEGER,
        unique: 'productassociation_association',
        references: null
      },
      associated_variant_id: {
        type: Sequelize.STRING,
        unique: 'productassociation_association',
        references: null
      },
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    }
  }
}
