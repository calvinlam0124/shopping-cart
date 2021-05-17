const db = require('../models')
const Product = db.Product

const PAGE_OFFSET = 0
const PAGE_LIMIT = 3

const productController = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAndCountAll({
        raw: true,
        nest: true,
        offset: PAGE_OFFSET,
        limit: PAGE_LIMIT
      })
      return res.render('products', { products })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = productController
