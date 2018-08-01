module.exports = {
  default: (app) => {
    return {
      include: [
        {
          model: app.models['Collection'].instance,
          as: 'collections',
          attributes: {
            exclude: ['created_at', 'updated_at']
          },
          include: [
            {
              model: app.models['Image'].instance,
              as: 'images',
              attributes: {
                exclude: ['src', 'created_at', 'updated_at']
              }
            }
          ]
        },
        {
          model: app.models['Image'].instance,
          as: 'images',
          attributes: {
            exclude: ['src', 'created_at', 'updated_at']
          }
        },
        {
          model: app.models['Tag'].instance,
          as: 'tags',
          attributes: ['name', 'id'],
          order: [['name', 'ASC']]
        }
      ]
      // order: [
      //   [
      //     {
      //       model: app.models['Image'],
      //       through: 'ItemImage',
      //       as: 'images'
      //     },
      //     'position'
      //   ]
      // ]
    }
  },
  findAndCountDefault: (app) => {
    return {
      distinct: true,
      include: [
        {
          model: app.models['Collection'].instance,
          as: 'collections',
          attributes: {
            exclude: ['created_at', 'updated_at']
          },
          include: [
            {
              model: app.models['Image'].instance,
              as: 'images',
              attributes: {
                exclude: ['src', 'created_at', 'updated_at']
              }
            }
          ]
        },
        {
          model: app.models['Image'].instance,
          as: 'images',
          attributes: {
            exclude: ['src', 'created_at', 'updated_at']
          }
        },
        {
          model: app.models['Tag'].instance,
          as: 'tags',
          attributes: ['name', 'id'],
          order: [['name', 'ASC']]
        }
      ]
      // order: [
      //   [
      //     {
      //       model: app.models['Image'],
      //       through: 'ItemImage',
      //       as: 'images'
      //     },
      //     'position'
      //   ]
      // ]
    }
  }
}
