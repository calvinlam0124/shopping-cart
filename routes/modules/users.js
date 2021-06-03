const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const jwt = require('jsonwebtoken')

const { authenticated } = require('../../middleware/auth')

const userController = require('../../controllers/userController')

router.get('/login', userController.getLoginPage)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.get('/register', userController.getRegisterPage)
router.post('/register', userController.register)
router.post('/register/captcha', userController.sendCaptcha)
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/users/login',
  session: false
}), (req, res) => {
  // console.log('google cb req.user===', req.user[0].id)
  const payload = { id: req.user[0].id }
  const expiresIn = { expiresIn: '10h' }
  const token = jwt.sign(payload, process.env.JWT_SECRET, expiresIn)
  req.session.token = token
  req.flash('success_msg', 'Google登入成功!')
  return res.redirect('/products')
})

module.exports = router
