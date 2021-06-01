const express = require('express')
const router = express.Router()

const userController = require('../../controllers/userController')

router.get('/login', userController.getLoginPage)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.get('/register', userController.getRegisterPage)
router.post('/register', userController.register)
router.post('/register/captcha', userController.sendCaptcha)

module.exports = router
