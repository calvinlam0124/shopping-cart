const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/orderController')

router.get('/', orderController.getOrders)
router.post('/', orderController.postOrder)
router.post('/:id/cancel', orderController.cancelOrder)

module.exports = router
