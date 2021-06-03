const db = require('../models')
const User = db.User

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { sendMail, registerMail } = require('../utils/sendMail')

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
      const expiresIn = { expiresIn: '10h' }
      const token = jwt.sign(payload, process.env.JWT_SECRET, expiresIn)
      req.session.token = token
      req.flash('success_msg', 'Login Success!')
      return res.status(200).redirect('/products')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  logout: (req, res) => {
    req.logout()
    req.session.email = ''
    req.session.cartId = ''
    req.session.token = ''
    req.flash('success_msg', 'Logout Success!')
    return res.status(200).redirect('/users/login')
  },
  getRegisterPage: (req, res) => {
    const email = req.session.email
    return res.render('register', { email })
  },
  register: async (req, res, next) => {
    try {
      const { email, captcha, password, checkPassword } = req.body
      if (password !== checkPassword) {
        req.flash('warning_msg', 'Password & CheckPassword不相符!')
        return res.status(400).redirect('back')
      }
      if (req.session.captcha !== captcha) {
        req.flash('warning_msg', '驗證碼錯誤!')
        return res.status(400).redirect('back')
      }
      const user = await User.findOne({ where: { email } })
      if (user) {
        req.flash('warning_msg', '這個Email被註冊過了!')
        return res.status(400).redirect('back')
      }
      // create user
      await User.create({
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        role: 'user'
      })
      req.session.captcha = ''
      req.flash('success_msg', 'Register Success!')
      return res.status(201).redirect('/users/login')
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  sendCaptcha: (req, res) => {
    // send mail
    const email = req.body.email
    let captcha = ''
    for (let i = 0; i < 6; i++) {
      captcha += Math.floor(Math.random() * 10)
    }
    const subject = `[TEST]卡羅購物 註冊驗證碼: ${captcha}`
    sendMail(email, subject, registerMail(captcha))
    // session store email & captcha
    req.session.email = email
    req.session.captcha = captcha
    req.flash('success_msg', `驗證碼已發送至此信箱:${email}`)
    return res.redirect('/users/register')
  },
  googleLogin: (req, res) => {
    const payload = { id: req.user[0].id }
    const expiresIn = { expiresIn: '10h' }
    const token = jwt.sign(payload, process.env.JWT_SECRET, expiresIn)
    req.session.token = token
    req.flash('success_msg', 'Google登入成功!')
    return res.redirect('/products')
  }
}

module.exports = userController
