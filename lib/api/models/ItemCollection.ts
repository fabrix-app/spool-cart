import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'

import { COLLECTION_MODELS } from '../../enums'
/**
 * @module ItemCollection
 * @description Item Collection Model n:m
 */
export class ItemCollection extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        // underscoredAll: true,
        // createdAt: 'created_at',
        // updatedAt: 'updated_at',
        enums: {
          COLLECTION_MODELS: COLLECTION_MODELS
        },
        indexes: [
          {
            fields: ['collection_id', 'model', 'model_id', 'position']
          }
        ]
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
      collection_id: {
        type: Sequelize.INTEGER,
        unique: 'collection_model',
        notNull: true
      },
      model: {
        type: Sequelize.ENUM,
        unique: 'collection_model',
        values: Object.values(COLLECTION_MODELS)
      },
      model_id: {
        type: Sequelize.INTEGER,
        unique: 'collection_model',
        notNull: true,
        references: null
      },
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.ItemCollection.belongsTo(models.Collection, {
      foreignKey: 'collection_id'
    })
  }
}
