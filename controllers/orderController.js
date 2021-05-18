const nodemailer = require('nodemailer')

const db = require('../models')
const Order = db.Order
const Cart = db.Cart
const OrderItem = db.OrderItem

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASSWORD
  }
})

const orderController = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        include: 'orderProducts'
      })
      // console.log(orders)
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
      const items = Array.from({ length: cart.cartProducts.length }).map((_, i) => (
        OrderItem.create({
          OrderId: order.id,
          ProductId: cart.cartProducts[i].id,
          price: cart.cartProducts[i].price,
          quantity: cart.cartProducts[i].CartItem.quantity
        })
      ))
      // send success mail
      const mailOptions = {
        from: process.env.USER_MAIL,
        to: process.env.USER_MAIL,
        subject: `${order.id} 訂單成立`,
        text: `${order.id} 訂單成立`
      }

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err)
        } else {
          console.log('Email sent: ' + info.response)
        }
      })

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
