const db = require('../models')
const User = db.User

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
      req.flash('success_msg', 'Login Success!')
      return res.redirect('/products')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  logout: (req, res) => {
    req.logout()
    req.session.user = ''
    req.session.email = ''
    req.flash('success_msg', 'Logout Success!')
    return res.redirect('/users/login')
  }
}

module.exports = userController
