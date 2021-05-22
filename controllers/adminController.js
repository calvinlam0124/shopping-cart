const db = require('../models')
const Product = db.Product

// imgur
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const uploadImg = path => {
  return new Promise((resolve, reject) => {
    imgur.upload(path, (err, img) => {
      if (err) {
        return reject(err)
      }
      return resolve(img)
    })
  })
}

const adminController = {
  // get all products
  getProducts: async (req, res) => {
    try {
      // status (default: create)
      // req.session.status = ''
      // const status = 'create'
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
      const { name, description, price } = req.body
      // if (!name || !price) {
      //   return res.redirect('')
      // }
      if (req.file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        const img = await uploadImg(req.file.path)
        await Product.create({ name, description, price, image: img.data.link })
      } else {
        await Product.create({ name, description, price })
      }
      return res.redirect('/admin/products')
    } catch (e) {
      console.log(e)
    }
  },
  // edit product page
  editProduct: async (req, res) => {
    try {
      // set status
      const status = 1
      // find the product
      const product = await Product.findByPk(req.params.id)
      // find products
      const products = await Product.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/products', { product: product.toJSON(), products, status })
    } catch (e) {
      console.log(e)
    }
  },
  // edit product
  putProduct: async (req, res) => {
    try {
      const { name, description, price } = req.body
      // if (!name || !price) {
      //   return res.redirect('')
      // }
      const product = await Product.findByPk(req.params.id)
      if (req.file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        const img = await uploadImg(req.file.path)
        await product.update({ name, description, price, image: img.data.link })
      } else {
        await product.update({ name, description, price, image: product.image })
      }
      return res.redirect('/admin/products')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
