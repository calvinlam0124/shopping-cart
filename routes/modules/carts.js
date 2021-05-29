const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')

const cartController = require('../../controllers/CartController')

router.get('/', authenticated, cartController.getCart)
router.post('/', authenticated, cartController.postCart)

module.exports = router
