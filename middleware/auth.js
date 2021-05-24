const db = require('../models')
const User = db.User

const passport = require('../config/passport')

// const authenticated = (req, res, next) => {
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (!user) {
//       console.log(err)
//       return res.redirect('/users/login')
//     }
//     return next()
//   })(req, res, next)
// }

// const authenticatedAdmin = (req, res, next) => {
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (!user) {
//       console.log(err)
//       return res.redirect('/login')
//     }
//     if (user.role !== 'admin') {
//       return res.redirect('/admin/login')
//     }
//     return next()
//   })(req, res, next)
// }

const authenticatedAdmin = async (req, res, next) => {
  if (!req.session.user.token) {
    return res.status(401).redirect('/admin/login')
  } else {
    if (req.session.user.role !== 'admin') {
      return res.status(403).redirect('/admin/login')
    }
    try {
      const user = await User.findByPk(req.session.user.id)
      req.user = user.toJSON()
      return next()
    } catch (e) {
      console.log(e)
    }
  }
}

const authenticated = async (req, res, next) => {
  if (!req.session.user.token) {
    return res.status(401).redirect('/users/login')
  } else {
    if (req.session.user.role !== 'user') {
      return res.status(403).redirect('/users/login')
    }
    try {
      const user = await User.findByPk(req.session.user.id)
      req.user = user.toJSON()
      return next()
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
