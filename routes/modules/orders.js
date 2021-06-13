const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/orderController')

router.get('/', orderController.getOrders)
router.get('/data', orderController.fillOrderData)
router.post('/data', orderController.postOrder)
router.post('/newebpay/callback', orderController.newebpayCallback)
router.get('/:id', orderController.getOrder)
router.post('/:id/cancel', orderController.cancelOrder)

module.exports = router
