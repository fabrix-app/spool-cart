export const ProductVariant = {
  default: (app) => {
    return {
      include: [
        {
          model: app.models['ProductImage'].instance,
          as: 'images',
          // attributes: {
          //   exclude: ['src', 'updated_at', 'created_at']
          // },
          order: [['position', 'ASC']]
        }
      ]
    }
  }
}
