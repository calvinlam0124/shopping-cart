const products = require('./modules/products')
const carts = require('./modules/carts')

module.exports = app => {
  app.use('/products', products)
  app.use('/cart', carts)
}
