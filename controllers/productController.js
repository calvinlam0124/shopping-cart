const db = require('../models')
const Product = db.Product
const Cart = db.Cart

const PAGE_LIMIT = 9

const productController = {
  getProducts: async (req, res, next) => {
    try {
      let PAGE_OFFSET = 0
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * PAGE_LIMIT
      }
      let products = await Product.findAndCountAll({
        offset: PAGE_OFFSET,
        limit: PAGE_LIMIT
      })
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(products.count / PAGE_LIMIT)
      const totalPage = Array.from({ length: pages }).map((_, i) => i + 1)
      const prev = page - 1 ? page - 1 : 1
      const next = page + 1 > pages ? pages : page + 1
      // description limit 50
      products = products.rows.map(product => ({
        ...product.dataValues,
        description: product.dataValues.description.substring(0, 50)
      }))
      // cart
      if (req.session.user) {
        let cart = await Cart.findOne({
          where: { UserId: req.session.user.id },
          include: 'cartProducts'
        })
        cart = cart.toJSON()
        const totalPrice = cart.cartProducts.length > 0 ? cart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
        return res.render('products', { products, cart, totalPrice, page, totalPage, prev, next })
      } else {
        if (req.session.cartId) {
          let cart = await Cart.findByPk(req.session.cartId, {
            include: 'cartProducts'
          })
          cart = cart.toJSON()
          const totalPrice = cart.cartProducts.length > 0 ? cart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
          return res.render('products', { products, cart, totalPrice, page, totalPage, prev, next })
        } else {
          return res.render('products', { products, page, totalPage, prev, next })
        }
      }
    } catch (e) {
      console.log(e)
      return next(e)
    }
  }
}

module.exports = productController
