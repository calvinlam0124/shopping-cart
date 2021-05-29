const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')

const cartController = require('../../controllers/CartController')

router.post('/:productId/add', authenticated, cartController.addCartItem)
router.post('/:productId/sub', authenticated, cartController.subCartItem)
router.delete('/:productId', authenticated, cartController.deleteCartItem)

module.exports = router
