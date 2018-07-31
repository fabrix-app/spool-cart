import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { values } from 'lodash'

import { TAG_MODELS } from '../../enums'

/**
 * @module ItemTag
 * @description Item Tag Model n:m
 */
export class ItemTag extends Model {

  static get resolver() {
    return SequelizeResolver
  }

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          TAG_MODELS: TAG_MODELS
        },
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
      tag_id: {
        type: Sequelize.INTEGER,
        unique: 'tag_model',
        notNull: true
      },
      model: {
        type: Sequelize.ENUM,
        unique: 'tag_model',
        values: values(TAG_MODELS)
      },
      model_id: {
        type: Sequelize.INTEGER,
        unique: 'tag_model',
        references: null
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.ItemTag.belongsTo(models.Tag, {
      foreignKey: 'tag_id'
    })
  }
}
