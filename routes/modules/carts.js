const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')
const checkToken = require('../../middleware/checkToken')

const cartController = require('../../controllers/CartController')

router.get('/', (req, res, next) => {
  checkToken(req, res, next, cartController.getCart)
}, authenticated, cartController.getCart)

router.post('/', (req, res, next) => {
  checkToken(req, res, next, cartController.postCart)
}, authenticated, cartController.postCart)

module.exports = router
