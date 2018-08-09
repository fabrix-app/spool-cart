export const Subscription = {
  default: (app) => {
    return {
      include: [
        {
          model: app.models['Customer'].instance,
          // as: 'customer'
        },
        // {
        //   model: app.models['Event'],
        //   as: 'events'
        // }
      ],
      // order: [
      //   [
      //     {
      //       model: app.models['Event'],
      //       as: 'events'
      //     },
      //     'created_at', 'DESC'
      //   ]
      // ]
    }
  }
}
