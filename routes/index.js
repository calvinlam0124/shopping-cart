const products = require('./modules/products')
const carts = require('./modules/carts')
const cartItems = require('./modules/cartItems')
const orders = require('./modules/orders')

module.exports = app => {
  app.use('/products', products)
  app.use('/cart', carts)
  app.use('/cartItem', cartItems)
  app.use('/orders', orders)
}
