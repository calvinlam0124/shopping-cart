const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')

const cartController = require('../../controllers/CartController')

router.post('/:productId/add', (req, res, next) => {
  if (req.session.token) {
    return next()
  } else {
    cartController.addCartItem(req, res, next)
  }
}, authenticated, cartController.addCartItem)

router.post('/:productId/sub', (req, res, next) => {
  if (req.session.token) {
    return next()
  } else {
    cartController.subCartItem(req, res, next)
  }
}, authenticated, cartController.subCartItem)

router.delete('/:productId', (req, res, next) => {
  if (req.session.token) {
    return next()
  } else {
    cartController.deleteCartItem(req, res, next)
  }
}, authenticated, cartController.deleteCartItem)

module.exports = router
