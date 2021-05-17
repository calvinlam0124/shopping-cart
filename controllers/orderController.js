const db = require('../models')
const Order = db.Order

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
  }
}

module.exports = orderController
