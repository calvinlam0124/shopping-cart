const db = require('../models')
const User = db.User
const Cart = db.Cart
const CartItem = db.CartItem

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userController = {
  getLoginPage: (req, res, next) => {
    const front = true
    const email = req.session.email
    return res.render('admin/login', { front, email })
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ where: { email } })
      req.session.email = email
      if (!user) {
        req.flash('warning_msg', 'Email incorrect!')
        return res.status(401).redirect('/users/login')
      }
      if (user.role !== 'user') {
        req.flash('danger_msg', 'No authority!')
        return res.status(403).redirect('/users/login')
      }
      if (!bcrypt.compareSync(password, user.password)) {
        req.flash('warning_msg', 'Password incorrect!')
        return res.status(401).redirect('/users/login')
      }
      // token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      req.session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        token
      }
      // login success & check cartId in session or not
      if (req.session.cartId) {
        const userCart = await Cart.findOne({
          where: { UserId: user.id }
        })
        if (!userCart) {
          const cart = await Cart.findByPk(req.session.cartId)
          await cart.update({ UserId: user.id })
        } else {
          // update cartId to user's cartId
          await CartItem.update(
            { CartId: userCart.id },
            { where: { CartId: req.session.cartId } }
          )
          // check if ProductId repeat
          const cartItems = await CartItem.findAll({
            raw: true,
            nest: true,
            where: { CartId: userCart.id }
          })
          // store ProductId
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
          await Cart.destroy(
            { where: { id: req.session.cartId } }
          )
          req.session.cartId = userCart.id
        }
      }

      req.flash('success_msg', 'Login Success!')
      return res.status(200).redirect('/products')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  logout: (req, res) => {
    req.logout()
    req.session.user = ''
    req.session.email = ''
    req.session.cartId = ''
    req.flash('success_msg', 'Logout Success!')
    return res.status(200).redirect('/users/login')
  },
  getRegisterPage: (req, res) => {
    const email = req.session.email
    return res.render('register', { email })
  },
  register: async (req, res, next) => {
    try {
      const { email, password, checkPassword } = req.body
      req.session.email = email
      if (password !== checkPassword) {
        req.flash('warning_msg', 'Password & CheckPassword must be same!')
        return res.status(400).redirect('back')
      }
      const user = await User.findOne({ where: { email } })
      if (user) {
        req.flash('warning_msg', 'This Email has been registered!')
        return res.status(400).redirect('back')
      }
      await User.create({
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        role: 'user'
      })
      req.flash('success_msg', 'Register Success!')
      return res.status(201).redirect('/users/login')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  }
}

module.exports = userController
