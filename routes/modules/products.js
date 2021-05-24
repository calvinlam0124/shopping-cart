const express = require('express')
const router = express.Router()

const productController = require('../../controllers/productController')

const { authenticated } = require('../../middleware/auth')

router.get('/', authenticated, productController.getProducts)

module.exports = router
