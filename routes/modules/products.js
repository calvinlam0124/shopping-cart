const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')
const checkToken = require('../../middleware/checkToken')

const productController = require('../../controllers/productController')

router.get('/', (req, res, next) => {
  checkToken(req, res, next, productController.getProducts)
}, authenticated, productController.getProducts)

module.exports = router
