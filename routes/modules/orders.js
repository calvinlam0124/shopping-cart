const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/orderController')

const { authenticated } = require('../../middleware/auth')

router.get('/', authenticated, orderController.getOrders)
router.post('/', authenticated, orderController.postOrder)
router.post('/:id/cancel', authenticated, orderController.cancelOrder)
router.get('/:id/payment', authenticated, orderController.getPayment)
router.post('/newebpay/callback', authenticated, orderController.newebpayCallback)

module.exports = router
