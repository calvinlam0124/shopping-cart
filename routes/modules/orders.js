const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/orderController')

router.get('/', orderController.getOrders)
router.post('/', orderController.postOrder)

module.exports = router
