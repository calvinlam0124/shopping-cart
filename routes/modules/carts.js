const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')

const cartController = require('../../controllers/CartController')

router.get('/', (req, res, next) => {
  if (req.session.token) {
    return next()
  } else {
    cartController.getCart(req, res, next)
  }
}, authenticated, cartController.getCart)

router.post('/', (req, res, next) => {
  if (req.session.token) {
    return next()
  } else {
    cartController.postCart(req, res, next)
  }
}, authenticated, cartController.postCart)

module.exports = router
