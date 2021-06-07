const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')
const checkToken = require('../../middleware/checkToken')

const cartController = require('../../controllers/CartController')

router.post('/:productId/add', (req, res, next) => {
  checkToken(req, res, next, cartController.addCartItem)
}, authenticated, cartController.addCartItem)

router.post('/:productId/sub', (req, res, next) => {
  checkToken(req, res, next, cartController.subCartItem)
}, authenticated, cartController.subCartItem)

router.delete('/:productId', (req, res, next) => {
  checkToken(req, res, next, cartController.deleteCartItem)
}, authenticated, cartController.deleteCartItem)

module.exports = router
