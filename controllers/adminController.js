const db = require('../models')
const Product = db.Product

const adminController = {
  // get all products
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/products', { products })
    } catch (e) {
      console.log(e)
    }
  },
  // create new product
  postProduct: async (req, res) => {
    try {
      const { name, description, price, image } = req.body
      // if (!name || !price) {
      //   return res.redirect('')
      // }
      await Product.create({ name, description, price, image })
      return res.redirect('/admin/products')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
