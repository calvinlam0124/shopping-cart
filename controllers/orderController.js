const db = require('../models')
const Order = db.Order
const Cart = db.Cart
const OrderItem = db.OrderItem

const orderController = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        include: 'orderProducts'
      })
      console.log(orders)
      return res.render('orders', { orders })
    } catch (e) {
      console.log(e)
    }
  },
  postOrder: async (req, res) => {
    try {
      // create order (cart -> order)
      const order = await Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        amount: req.body.amount,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status
      })
      // create orderItem (cartItem -> orderItem)
      const cart = await Cart.findByPk(req.body.cartId, {
        include: 'cartProducts'
      })
      const items = Array.from({ length: 2 }).map((_, i) => (
        OrderItem.create({
          OrderId: order.id,
          ProductId: cart.cartProducts[i].id,
          price: cart.cartProducts[i].price,
          quantity: cart.cartProducts[i].CartItem.quantity
        })
      ))
      Promise.all(items)
      // clear cart & cartItem
      await cart.destroy()
      // clear cartId in session
      req.session.cartId = ''
      return res.redirect('/orders')
    } catch (e) {
      console.log(e)
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      await order.update({
        shipping_status: '-1',
        payment_status: '-1'
      })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = orderController
