# spool-cart

[![Waffle.io - Columns and their card count](https://badge.waffle.io/CaliStyle/spool-cart.svg?columns=all)](https://waffle.io/CaliStyle/spool-cart)

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

## Node.js eCommerce built for speed, scalability, flexibility, and love from [Cali Style](https://cali-style.com)
Proxy Cart is the eCommerce component for [Proxy Engine](https://github.com/calistyle/spool-engine). Connect your own [Merchant Processor, Shipping Provider, Fulfillment Service, Tax Provider](https://github.com/calistyle/spool-generics), and import your products. Attach it to Proxy Engine and you have a fully REST API based eCommerce solution!

# Documentation
[Proxy Cart Documentation](https://calistyle.github.io/cart-docs)

## Development Notes
Proxy Cart currently only support sequelize on Postgres. To contribute to Proxy Cart, first create a Local Postgres Database named `ProxyCart`. Then test the build with `DIALECT=postgres npm test`. 

[npm-image]: https://img.shields.io/npm/v/spool-cart.svg?style=flat-square
[npm-url]: https://npmjs.org/package/spool-cart
[ci-image]: https://img.shields.io/circleci/project/github/CaliStyle/spool-cart/master.svg
[ci-url]: https://circleci.com/gh/CaliStyle/spool-cart/tree/master
[daviddm-image]: http://img.shields.io/david/calistyle/spool-cart.svg?style=flat-square
[daviddm-url]: https://david-dm.org/calistyle/spool-cart
[codeclimate-image]: https://img.shields.io/codeclimate/github/calistyle/spool-cart.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/calistyle/spool-cart
