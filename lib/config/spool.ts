// tslint:disable:max-line-length
/**
 * Spool Configuration
 *
 * @see {@link http://fabrixjs.io/doc/spool/config
 */
export const spool = {
  type: 'misc',
  /**
   * API and config resources provided by this Spool.
   */
  provides: {
    resources: ['controllers', 'models', 'services', 'events', 'crons', 'emails'],
    api: {
      controllers: ['CartController', 'CollectionController', 'CountryController', 'CouponController', 'CustomerController', 'DiscountController', 'FulfillmentController', 'OrderController', 'ProductController', 'ProxyCartController', 'ReviewController', 'ShopController', 'SubscriptionController', 'TagController', 'TransactionController', 'UserController', 'VendorController'],
      services: ['AccountService', 'CartService', 'CollectionCsvService', 'CollectionService', 'CountryService', 'CouponService', 'CustomerCsvService', 'CustomerService', 'DiscountService', 'FulfillmentService', 'GiftCardService', 'OrderCsvService', 'OrderService', 'PaymentService', 'ProductCsvService', 'ProductService', 'ProxyCartService', 'ReviewService', 'ShippingService', 'ShopService', 'SubscriptionService', 'TagService', 'TaxService', 'TransactionService', 'VendorCsvService', 'VendorService'],
      models: ['Account', 'Address', 'Cart', 'City', 'Collection', 'Country', 'County', 'Coupon', 'Customer', 'CustomerAccount', 'CustomerCart', 'CustomerOrder', 'CustomerSource', 'CustomerUpload', 'CustomerUser', 'Discount', 'Fulfillment', 'FulfillmentEvent', 'GiftCard', 'Image', 'ItemAddress', 'ItemCollection', 'ItemCoupon', 'ItemDiscount', 'ItemImage', 'ItemRefund', 'ItemShippingZone', 'ItemTag', 'Metadata', 'Order', 'OrderItem', 'OrderRisk', 'OrderSource', 'OrderUpload', 'Product', 'ProductAssociation', 'ProductAssociationUpload', 'ProductImage', 'ProductMetaUpload', 'ProductReview', 'ProductUpload', 'ProductVariant', 'Province', 'Refund', 'Shop', 'ShopProduct', 'Source', 'Subscription', 'SubscriptionUpload', 'Tag', 'Transaction', 'User', 'Vendor', 'VendorProduct', 'VendorUpload'],
      events: [],
      crons: [],
      tasks: []
    },
    config: ['cart', 'routes', 'policies']
  },
  /**
   * Configure the lifecycle of this pack; that is, how it boots up, and which
   * order it loads relative to other spools.
   */
  lifecycle: {
    configure: {
      /**
       * List of events that must be fired before the configure lifecycle
       * method is invoked on this Spool
       */
      listen: [
        'spool:sequelize:configured',
        'spool:engine:configured',
        'spool:generics:configured',
        'spool:permissions:configured'
      ],

      /**
       * List of events emitted by the configure lifecycle method
       */
      emit: [
        'spool:cart:configured'
      ]
    },
    initialize: {
      listen: [
        'spool:sequelize:initialized',
        'spool:engine:initialized',
        'spool:permissions:initialized',
        'spool:generics:initialized'
      ],
      emit: [
        'spool:cart:initialized'
      ]
    }
  }
}

