module.exports = {
  default: (app) => {
    return {
      include: [
        {
          model: app.models['ProductImage'],
          as: 'images',
          // attributes: {
          //   exclude: ['src', 'updated_at', 'created_at']
          // },
          order: [['position', 'ASC']]
        },
        {
          model: app.models['Tag'],
          as: 'tags',
          attributes: ['name', 'id'],
          order: [['name', 'ASC']]
        },
        {
          model: app.models['ProductVariant'],
          as: 'variants',
          attributes: {
            exclude: ['updated_at', 'created_at']
          },
          include: [
            {
              model: app.models['Metadata'],
              as: 'metadata',
              attributes: ['data', 'id']
            },
            {
              model: app.models['ProductImage'],
              as: 'images',
              order: [['position', 'ASC']],
              attributes: {
                exclude: ['src', 'updated_at', 'created_at']
              }
            }
          ]
        },
        // {
        //   model: app.models['Product'],
        //   as: 'associations',
        //   // duplicating: false
        // },
        {
          model: app.models['Metadata'],
          as: 'metadata',
          attributes: ['data', 'id']
        },
        {
          model: app.models['Vendor'],
          as: 'vendors',
          attributes: ['id', 'handle', 'name']
        },
        {
          model: app.models['Collection'],
          as: 'collections',
          attributes: [
            'id',
            'title',
            'handle',
            'tax_type',
            'tax_rate',
            'tax_name',
            // 'discount_scope',
            // 'discount_type',
            // 'discount_rate',
            // 'discount_percentage'
          ]
        }
      ],
      order: [
        [
          {
            model: app.models['ProductVariant'],
            as: 'variants'
          },
          'position', 'ASC'
        ],
        [
          {
            model: app.models['ProductImage'],
            as: 'images'
          },
          'position', 'ASC'
        ]
      ]
    }
  },
  findAllDefault: (app) => {
    return {
      distinct: true,
      include: [
        {
          model: app.models['ProductImage'],
          as: 'images',
        },
        {
          model: app.models['Tag'],
          as: 'tags',
          attributes: ['name', 'id']
        },
        // {
        //   model: app.models['Product'],
        //   as: 'associations',
        //   duplicating: false
        // },
        {
          model: app.models['Collection'],
          as: 'collections',
          // duplicating: false,
          // require: true,
          attributes: [
            'id',
            'title',
            'handle',
            'tax_type',
            'tax_rate',
            'tax_name',
            // 'discount_scope',
            // 'discount_type',
            // 'discount_rate',
            // 'discount_percentage'
          ]
        },
        {
          model: app.models['Vendor'],
          as: 'vendors',
          // duplicating: false,
          // require: true,
          attributes: [
            'id',
            'handle',
            'name'
          ]
        }
      ],
      order: [
        [
          {
            model: app.models['ProductImage'],
            as: 'images'
          },
          'position', 'ASC'
        ]
      ]
    }
  },
  collections: (app) => {
    return {
      include: [
        {
          model: app.models['Collection'],
          as: 'collections',
          // duplicating: false,
          // require: true,
          attributes: [
            'id',
            'title',
            'handle',
            'tax_type',
            'tax_rate',
            'tax_name',
            // 'discount_scope',
            // 'discount_type',
            // 'discount_rate',
            // 'discount_percentage'
          ]
        }
      ]
    }
  },
  images: (app) => {
    return {
      include: [
        {
          model: app.models['ProductImage'],
          as: 'images'
        }
      ],
      order: [
        [
          {
            model: app.models['ProductImage'],
            as: 'images'
          },
          'position', 'ASC'
        ]
      ]
    }
  },
  tags: (app) => {
    return {
      include: [
        {
          model: app.models['Tag'],
          as: 'tags',
          attributes: ['name', 'id']
        }
      ],
      order: [
        [
          {
            model: app.models['Tag'],
            as: 'tags'
          },
          'name', 'ASC'
        ]
      ]
    }
  },
  variants: (app) => {
    return {
      include: [
        {
          model: app.models['ProductVariant'],
          as: 'variants',
          attributes: {
            exclude: ['updated_at', 'created_at']
          },
          include: [
            {
              model: app.models['Metadata'],
              as: 'metadata',
              attributes: ['data', 'id']
            },
            {
              model: app.models['ProductImage'],
              as: 'images',
              order: [['position', 'ASC']],
              attributes: {
                exclude: ['src', 'updated_at', 'created_at']
              }
            }
          ]
        }
      ]
    }
  }
}
