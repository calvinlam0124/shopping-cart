const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')

const productController = require('../../controllers/productController')

router.get('/', (req, res, next) => {
  if (req.session.token) {
    return next()
  } else {
    productController.getProducts(req, res, next)
  }
}, authenticated, productController.getProducts)

module.exports = router
