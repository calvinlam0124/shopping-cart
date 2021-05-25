const nodemailer = require('nodemailer')

const db = require('../models')
const Order = db.Order
const Cart = db.Cart
const OrderItem = db.OrderItem

const { getData, decryptData } = require('../utils/handleMpgData')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASSWORD
  }
})

const orderController = {
  getOrders: async (req, res, next) => {
    try {
      const ordersHavingProducts = await Order.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.session.user.id },
        include: 'orderProducts'
      })
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.session.user.id }
      })
      orders.forEach(order => {
        order.orderProducts = []
      })
      ordersHavingProducts.forEach(product => {
        const index = orders.findIndex(order => order.id === product.id)
        if (index === -1) return
        orders[index].orderProducts.push(product.orderProducts)
      })
      return res.render('orders', { orders })
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  postOrder: async (req, res, next) => {
    try {
      // create order (cart -> order)
      const order = await Order.create({
        UserId: req.session.user.id,
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
          return next(err)
        } else {
          console.log('Email sent: ' + info.response)
        }
      })

      Promise.all(items)
      // clear cart & cartItem
      await cart.destroy()
      // clear cartId in session
      req.session.cartId = ''
      req.flash('success_msg', '訂單下定成功!')
      return res.status(201).redirect('/orders')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  cancelOrder: async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.id)
      await order.update({
        shipping_status: '-1'
      })
      req.flash('danger_msg', `訂單編號${order.id} 已取消!`)
      return res.status(200).redirect('back')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  getPayment: async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.id)
      const tradeData = getData(order.amount, 'good products', 'user@example.com')
      console.log('***tradeData***', tradeData)
      // save MerchantOrderNo to sn
      await order.update({
        sn: tradeData.MerchantOrderNo.toString()
      })
      return res.render('payment', { order: order.toJSON(), tradeData })
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  newebpayCallback: async (req, res, next) => {
    try {
      const data = JSON.parse(decryptData(req.body.TradeInfo))
      console.log('***data***', data)
      const order = await Order.findOne({ where: { sn: data.Result.MerchantOrderNo } })
      await order.update({ payment_status: 1 })
      req.flash('success_msg', `訂單編號:${order.id} 付款成功!`)
      return res.status(200).redirect('/orders')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  }
}

module.exports = orderController
