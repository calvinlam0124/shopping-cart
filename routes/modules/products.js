const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')

const productController = require('../../controllers/productController')

router.get('/', authenticated, productController.getProducts)

module.exports = router
