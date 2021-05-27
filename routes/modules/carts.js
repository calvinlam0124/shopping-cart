const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/cartController')

const { authenticated } = require('../../middleware/auth')

router.get('/', authenticated, cartController.getCart)
router.post('/', authenticated, cartController.postCart)

module.exports = router
