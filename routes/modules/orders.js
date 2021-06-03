const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/orderController')

router.get('/', orderController.getOrders)
router.post('/', orderController.postOrder)
router.post('/:id/cancel', orderController.cancelOrder)
router.get('/:id/payment', orderController.getPayment)
router.post('/newebpay/callback', orderController.newebpayCallback)

module.exports = router
