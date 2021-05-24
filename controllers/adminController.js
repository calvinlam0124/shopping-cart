const db = require('../models')
const Product = db.Product
const User = db.User
const Order = db.Order

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
  loginPage: (req, res) => {
    const email = req.session.email
    return res.render('admin/login', { email })
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ where: { email } })
      req.session.email = email
      if (!user) {
        req.flash('warning_msg', 'Email incorrect!')
        return res.status(401).redirect('/admin/login')
      }
      if (user.role !== 'admin') {
        req.flash('danger_msg', 'No authority!')
        return res.status(403).redirect('/admin/login')
      }
      if (!bcrypt.compareSync(password, user.password)) {
        req.flash('warning_msg', 'Password incorrect!')
        return res.status(401).redirect('/admin/login')
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
      req.flash('success_msg', 'Login Success!')
      return res.redirect('/admin/products')
    } catch (e) {
      console.log(e)
    }
  },
  logout: (req, res) => {
    req.logout()
    req.session.user = ''
    req.session.email = ''
    req.flash('success_msg', 'Logout Success!')
    return res.redirect('/admin/login')
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
      if (!description || !price) {
        req.flash('warning_msg', 'name & price are required!')
      }
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
  },
  // get orders
  getOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/orders', { orders })
    } catch (e) {
      console.log(e)
    }
  },
  // get order
  getOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: 'orderProducts'
      })
      return res.render('admin/order', { order: order.toJSON() })
    } catch (e) {
      console.log(e)
    }
  },
  // ship order
  shipOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      if (!order) {
        req.flash('warning_msg', 'can not find this order!')
      } else {
        await order.update({ shipping_status: 1 })
        req.flash('success_msg', 'Ship Order Success!')
      }
      return res.status(200).redirect('/admin/orders')
    } catch (e) {
      console.log(e)
    }
  },
  // cancel order
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      if (!order) {
        req.flash('warning_msg', 'can not find this order!')
      } else {
        await order.update({ shipping_status: -1 })
        req.flash('success_msg', 'Cancel Order Success!')
      }
      return res.status(200).redirect('/admin/orders')
    } catch (e) {
      console.log(e)
    }
  },
  // recover order
  recoverOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      if (!order) {
        req.flash('warning_msg', 'can not find this order!')
      } else {
        await order.update({ shipping_status: 0 })
        req.flash('success_msg', 'Recover Order Success!')
      }
      return res.status(200).redirect('/admin/orders')
    } catch (e) {
      console.log(e)
    }
  },
  // get users
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        raw: true,
        nest: true
      })
      const currentUser = req.user
      return res.status(200).render('admin/users', { users, currentUser })
    } catch (e) {
      console.log(e)
    }
  },
  // change auth
  changeAuth: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) {
        req.flash('warning_msg', 'can not find this user!')
      } else {
        if (user.role === 'admin') {
          await user.update({ role: 'user' })
        } else {
          await user.update({ role: 'admin' })
        }
        req.flash('success_msg', `Id${user.id}: Change Auth to ${user.role} Success!`)
        return res.status(200).redirect('/admin/authority')
      }
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
