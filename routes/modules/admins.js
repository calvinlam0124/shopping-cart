const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const { authenticatedAdmin } = require('../../middleware/auth')

const adminController = require('../../controllers/adminController')

router.get('/login', adminController.loginPage)
router.post('/login', adminController.login)
router.get('/logout', adminController.logout)

router.get('/products', authenticatedAdmin, adminController.getProducts)
router.post('/products', authenticatedAdmin, upload.single('image'), adminController.postProduct)
router.get('/products/:id', authenticatedAdmin, adminController.editProduct)
router.put('/products/:id', authenticatedAdmin, upload.single('image'), adminController.putProduct)
router.delete('/products/:id', authenticatedAdmin, adminController.deleteProduct)
router.get('/orders', authenticatedAdmin, adminController.getOrders)
router.get('/orders/:id', authenticatedAdmin, adminController.getOrder)

module.exports = router
