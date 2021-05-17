const db = require('../models')
const Product = db.Product
const Cart = db.Cart

const PAGE_OFFSET = 0
const PAGE_LIMIT = 3

const productController = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        offset: PAGE_OFFSET,
        limit: PAGE_LIMIT
      })

      if (req.session.cartId) {
        let cart = await Cart.findByPk(req.session.cartId, {
          include: 'cartProducts'
        })
        cart = cart.toJSON()
        const totalPrice = cart.cartProducts.length > 0 ? cart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
        return res.render('products', { products, cart, totalPrice })
      }
      return res.render('products', { products })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = productController
