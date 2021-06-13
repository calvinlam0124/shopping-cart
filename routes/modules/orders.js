const express = require('express')
const router = express.Router()

const orderController = require('../../controllers/orderController')

router.get('/', orderController.getOrders)
router.post('/:id/cancel', orderController.cancelOrder)
router.post('/newebpay/callback', orderController.newebpayCallback)
router.get('/data', orderController.fillOrderData)
router.post('/data', orderController.postOrder)
router.get('/check', orderController.checkOrder)

module.exports = router
