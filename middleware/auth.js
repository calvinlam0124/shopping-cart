const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      console.log(err)
      return res.redirect('/users/login')
    }
    req.user = user.toJSON()
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      console.log(err)
      return res.redirect('/admin/login')
    }
    if (user.role !== 'admin') {
      return res.redirect('/admin/login')
    }
    req.user = user.toJSON()
    return next()
  })(req, res, next)
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
