const db = require('../models')
const Cart = db.Cart

const cartController = {
  getCart: async (req, res) => {
    try {
      const cart = await Cart.findOne({ id: 64 })
      return res.render('cart', { cart: cart.toJSON() })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = cartController
