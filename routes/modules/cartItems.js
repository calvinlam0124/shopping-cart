const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/cartController')

router.post('/:productId/add', cartController.addCartItem)
router.post('/:productId/sub', cartController.subCartItem)
router.delete('/:productId', cartController.deleteCartItem)

module.exports = router
