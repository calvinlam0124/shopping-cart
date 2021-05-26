const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const { authenticatedAdmin } = require('../../middleware/auth')
const locals = require('../../middleware/locals')

const adminController = require('../../controllers/adminController')

router.get('/login', adminController.loginPage)
router.post('/login', adminController.login)
router.get('/logout', adminController.logout)

// products
router.get('/products', authenticatedAdmin, locals, adminController.getProducts)
router.post('/products', authenticatedAdmin, locals, upload.single('image'), adminController.postProduct)
router.get('/products/:id', authenticatedAdmin, locals, adminController.editProduct)
router.put('/products/:id', authenticatedAdmin, locals, upload.single('image'), adminController.putProduct)
router.delete('/products/:id', authenticatedAdmin, locals, adminController.deleteProduct)

// orders
router.get('/orders', authenticatedAdmin, locals, adminController.getOrders)
router.get('/orders/:id', authenticatedAdmin, locals, adminController.getOrder)
router.get('/orders/:id', authenticatedAdmin, locals, adminController.getOrder)
router.post('/orders/:id/ship', authenticatedAdmin, locals, adminController.shipOrder)
router.post('/orders/:id/cancel', authenticatedAdmin, locals, adminController.cancelOrder)
router.post('/orders/:id/recover', authenticatedAdmin, locals, adminController.recoverOrder)

// authority
router.get('/authority', authenticatedAdmin, locals, adminController.getUsers)
router.post('/authority/:id', authenticatedAdmin, locals, adminController.changeAuth)

module.exports = router
