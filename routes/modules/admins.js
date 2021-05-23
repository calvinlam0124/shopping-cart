const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const { authenticatedAdmin } = require('../../middleware/auth')

const adminController = require('../../controllers/adminController')

router.get('/products', authenticatedAdmin, adminController.getProducts)
router.post('/products', authenticatedAdmin, upload.single('image'), adminController.postProduct)
router.get('/products/:id', authenticatedAdmin, adminController.editProduct)
router.put('/products/:id', authenticatedAdmin, upload.single('image'), adminController.putProduct)
router.delete('/products/:id', authenticatedAdmin, adminController.deleteProduct)

module.exports = router
