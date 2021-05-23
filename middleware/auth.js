const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      console.log(err)
      return res.redirect('/login')
    }
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      console.log(err)
      return res.redirect('/login')
    }
    if (req.user.role !== 'admin') {
      return res.redirect('/admin/login')
    }
    return next()
  })(req, res, next)
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
