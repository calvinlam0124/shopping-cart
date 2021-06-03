const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const jwt = require('jsonwebtoken')

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
}), userController.googleLogin)

module.exports = router
