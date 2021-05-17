const db = require('../models')
const Cart = db.Cart

const cartController = {
  getCart: async (req, res) => {
    try {
      const cart = await Cart.findOne({ include: 'items' })
      const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', { cart, totalPrice })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = cartController
