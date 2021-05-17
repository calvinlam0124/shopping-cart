const db = require('../models')
const Product = db.Product

const productController = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll()
      return res.render('products', { products })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = productController
