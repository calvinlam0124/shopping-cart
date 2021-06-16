const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const CartItem = db.CartItem

const PAGE_LIMIT = 9

const productController = {
  getProducts: async (req, res, next) => {
    try {
      // page
      let PAGE_OFFSET = 0
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * PAGE_LIMIT
      }
      let products = await Product.findAndCountAll({
        where: { deletedAt: null },
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
      // check how to show cart
      if (!req.user) {
        if (!req.session.cartId) {
          return res.render('products', { products, page, totalPage, prev, next })
        } else {
          let cart = await Cart.findByPk(req.session.cartId, {
            include: 'cartProducts'
          })
          cart = cart.toJSON()
          const totalPrice = cart.cartProducts.length > 0 ? cart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
          return res.render('products', { products, cart, totalPrice, page, totalPage, prev, next })
        }
      } else {
        // find if user has cart
        let cart = await Cart.findOne({
          where: { UserId: req.user.id },
          include: 'cartProducts'
        })
        if (!req.session.cartId) {
          if (!cart) {
            return res.render('products', { products, page, totalPage, prev, next })
          } else {
            cart = cart.toJSON()
            const totalPrice = cart.cartProducts.length > 0 ? cart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', { products, cart, totalPrice, page, totalPage, prev, next })
          }
        } else {
          if (!cart) {
            // update cart's userId
            await Cart.update(
              { UserId: req.user.id },
              { where: { id: req.session.cartId } }
            )
            let userCart = await Cart.findOne({
              where: { UserId: req.user.id },
              include: 'cartProducts'
            })
            userCart = userCart.toJSON()
            const totalPrice = userCart.cartProducts.length > 0 ? userCart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', { products, cart: userCart, totalPrice, page, totalPage, prev, next })
          } else {
            // update cartId to user's cartId
            await CartItem.update(
              { CartId: cart.id },
              { where: { CartId: req.session.cartId } }
            )
            // find all products
            const cartItems = await CartItem.findAll({
              raw: true,
              nest: true,
              where: { CartId: cart.id }
            })
            // store ProductId to check if ProductId repeat
            const map = new Map()
            for (const item of cartItems) {
              if (map.get(item.ProductId)) {
              // update quantity
                const cartItem = await CartItem.findByPk(map.get(item.ProductId))
                Promise.all([
                  cartItem.update({ quantity: cartItem.quantity + 1 }),
                  // destroy repeated data
                  await CartItem.destroy({ where: { id: item.id } })
                ])
              } else {
                map.set(item.ProductId, item.id)
              }
            }
            // remove cart (UserId = 0)
            if (cart.id !== req.session.cartId) {
              await Cart.destroy(
                { where: { id: req.session.cartId } }
              )
            } else {
              req.session.cartId = cart.id
            }
            let userCart = await Cart.findByPk(cart.id, {
              include: 'cartProducts'
            })
            userCart = userCart.toJSON()
            const totalPrice = userCart.cartProducts.length > 0 ? userCart.cartProducts.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
            return res.render('products', { products, cart: userCart, totalPrice, page, totalPage, prev, next })
          }
        }
      }
    } catch (e) {
      console.log(e)
      return next(e)
    }
  }
}

module.exports = productController
