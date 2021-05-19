const nodemailer = require('nodemailer')

const db = require('../models')
const Order = db.Order
const Cart = db.Cart
const OrderItem = db.OrderItem

const { getMpgData } = require('../utils/getMpgData')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASSWORD
  }
})

//
// const crypto = require("crypto")
// const URL = 'http://5398463a6a33.ngrok.io'
// const MerchantID = process.env.MerchantID
// const HashKey = process.env.HashKey
// const HashIV = process.env.HashIV
// const PayGateWay = "https://ccore.spgateway.com/MPG/mpg_gateway"
// const ReturnURL = URL+"/spgateway/callback?from=ReturnURL"
// const NotifyURL = URL+"/spgateway/callback?from=NotifyURL"
// const ClientBackURL = URL+"/orders"

// function genDataChain(TradeInfo) {
//   let results = [];
//   for (let kv of Object.entries(TradeInfo)) {
//     results.push(`${kv[0]}=${kv[1]}`);
//   }
//   return results.join("&");
// }

// function create_mpg_aes_encrypt(TradeInfo) {
//   let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV);
//   let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
//   return enc + encrypt.final("hex");
// }

// function create_mpg_sha_encrypt(TradeInfo) {

//   let sha = crypto.createHash("sha256");
//   let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

//   return sha.update(plainText).digest("hex").toUpperCase();
// }

// function getTradeInfo(Amt, Desc, email){
//   // console.log('===== getTradeInfo =====')
//   // console.log(Amt, Desc, email)
//   // console.log('==========')

//   data = {
//     'MerchantID': MerchantID, // 商店代號
//     'RespondType': 'JSON', // 回傳格式
//     'TimeStamp': Date.now(), // 時間戳記
//     'Version': 1.5, // 串接程式版本
//     'MerchantOrderNo': Date.now(), // 商店訂單編號
//     'LoginType': 0, // 智付通會員
//     'OrderComment': 'OrderComment', // 商店備註
//     'Amt': Amt, // 訂單金額
//     'ItemDesc': Desc, // 產品名稱
//     'Email': email, // 付款人電子信箱
//     'ReturnURL': ReturnURL, // 支付完成返回商店網址
//     'NotifyURL': NotifyURL, // 支付通知網址/每期授權結果通知
//     'ClientBackURL': ClientBackURL, // 支付取消返回商店網址
//   }

//   // console.log('===== getTradeInfo: data =====')
//   // console.log(data)


//   mpg_aes_encrypt = create_mpg_aes_encrypt(data)
//   mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

//   // console.log('===== getTradeInfo: mpg_aes_encrypt, mpg_sha_encrypt =====')
//   // console.log(mpg_aes_encrypt)
//   // console.log(mpg_sha_encrypt)

//   tradeInfo = {
//     'MerchantID': MerchantID, // 商店代號
//     'TradeInfo': mpg_aes_encrypt, // 加密後參數
//     'TradeSha': mpg_sha_encrypt,
//     'Version': 1.5, // 串接程式版本
//     'PayGateWay': PayGateWay,
//     'MerchantOrderNo': data.MerchantOrderNo,
//   }

//   // console.log('===== getTradeInfo: tradeInfo =====')
//   // console.log(tradeInfo)

//   return tradeInfo
// }


const orderController = {
  getOrders: async (req, res) => {
    try {
      const ordersHavingProducts = await Order.findAll({
        raw: true,
        nest: true,
        include: 'orderProducts'
      })
      const orders = await Order.findAll({
        raw: true,
        nest: true
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
  },
  getPayment: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      const tradeData = getMpgData(order.id, order.amount, 'good products', 'user@example.com')
      console.log('***tradeData***', tradeData)
      return res.render('payment', { order: order.toJSON(), tradeData })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = orderController
