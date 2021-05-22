const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/adminController')

router.get('/products', adminController.getProducts)
router.post('/products', adminController.postProduct)

module.exports = router
