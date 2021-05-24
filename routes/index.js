const users = require('./modules/users')
const products = require('./modules/products')
const carts = require('./modules/carts')
const cartItems = require('./modules/cartItems')
const orders = require('./modules/orders')
const admins = require('./modules/admins')

module.exports = app => {
  app.use('/users', users)
  app.use('/products', products)
  app.use('/cart', carts)
  app.use('/cartItem', cartItems)
  app.use('/orders', orders)
  app.use('/admin', admins)
  app.use('/', (req, res) => { return res.redirect('/users/login') })
}
