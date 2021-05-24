const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem

const cartController = {
  getCart: async (req, res, next) => {
    try {
      if (req.session.cartId) {
        const cart = await Cart.findByPk(req.session.cartId, {
          include: 'cartProducts'
        })
        const totalPrice = cart.cartProducts.length > 0 ? cart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
        return res.render('cart', { cart: cart.toJSON(), totalPrice })
      }
      return res.render('cart')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  postCart: async (req, res, next) => {
    try {
      // find cart or create
      const [cart] = await Cart.findOrCreate({ where: { id: req.session.cartId || 0 } })
      // find items in the cart or not
      const [product, created] = await CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.body.productId
        },
        defaults: {
          quantity: 1
        }
      })
      if (!created) {
        product.quantity += 1
      }
      await product.save()
      // save cartId in session
      req.session.cartId = cart.id
      return res.redirect('back')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  addCartItem: async (req, res, next) => {
    try {
      // find cart
      const product = await CartItem.findByPk(req.params.productId)
      await product.update({
        quantity: product.quantity + 1
      })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  subCartItem: async (req, res, next) => {
    try {
      // find cart
      const product = await CartItem.findByPk(req.params.productId)
      await product.update({
        quantity: product.quantity - 1 ? product.quantity - 1 : 1
      })
      return res.redirect('back')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  deleteCartItem: async (req, res, next) => {
    try {
      // find cart
      const product = await CartItem.findByPk(req.params.productId)
      await product.destroy()
      return res.redirect('back')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  }
}

module.exports = cartController
