const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../../controllers/adminController')

router.get('/products', adminController.getProducts)
router.post('/products', upload.single('image'), adminController.postProduct)

module.exports = router
