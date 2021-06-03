const db = require('../models')
const Order = db.Order
const Cart = db.Cart
const OrderItem = db.OrderItem

const { getData, decryptData } = require('../utils/handleMpgData')
const { sendMail, mailContent } = require('../utils/sendMail')

const orderController = {
  getOrders: async (req, res, next) => {
    try {
      const ordersHavingProducts = await Order.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.user.id },
        include: 'orderProducts'
      })
      const orders = await Order.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.user.id }
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
        UserId: req.user.id,
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
      Promise.all(items)
      // send mail
      const email = req.user.email
      const subject = `[TEST]卡羅購物 訂單號碼:${order.id} 成立 請把握時間付款`
      const status = '未出貨 / 未付款'
      const msg = '請點擊付款連結並使用測試信用卡付款! 感謝配合!'
      sendMail(email, subject, mailContent(order, status, msg))
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
      const tradeData = getData(order.amount, 'good products', req.user.email)
      console.log('***tradeData***', tradeData)
      // save MerchantOrderNo to sn
      await order.update({
        sn: tradeData.MerchantOrderNo.toString()
      })
      return res.render('payment', { order: order.toJSON(), tradeData, token: req.session.token })
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  newebpayCallback: async (req, res, next) => {
    try {
      console.log('===token===', req.session.token)
      const data = JSON.parse(decryptData(req.body.TradeInfo))
      console.log('***data***', data)
      const order = await Order.findOne({ where: { sn: data.Result.MerchantOrderNo } })
      await order.update({ payment_status: 1 })
      // send mail
      const email = req.user.email
      const subject = `[TEST]卡羅購物 訂單編號:${order.id} 付款成功!`
      const status = '未出貨 / 已付款'
      const msg = '近期內會安排出貨 再麻煩注意電子郵件!'
      sendMail(email, subject, mailContent(order, status, msg))
      // flash msg
      req.flash('success_msg', `訂單編號:${order.id} 付款成功!`)
      return res.status(200).redirect('/orders')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  }
}

module.exports = orderController
