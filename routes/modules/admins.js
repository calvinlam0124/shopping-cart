const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../../controllers/adminController')

router.get('/products', adminController.getProducts)
router.post('/products', upload.single('image'), adminController.postProduct)
router.get('/products/:id', adminController.editProduct)
router.put('/products/:id', upload.single('image'), adminController.putProduct)

module.exports = router
