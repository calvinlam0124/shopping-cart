const db = require('../models')
const Product = db.Product
const User = db.User

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
  login: async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json({ status: 'error', msg: 'email & password are required!' })
      }
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ status: 'error', msg: 'this email has not been registered!' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', msg: 'password incorrect!' })
      }
      if (user.role !== 'admin') {
        return res.status(403).json({ status: 'error', msg: 'No authority!' })
      }
      // token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      req.session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        token
      }
      return res.redirect('/admin/products')
    } catch (e) {
      console.log(e)
    }
  },
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
  },
  // delete product
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id)
      await product.destroy()
      return res.redirect('/admin/products')
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
