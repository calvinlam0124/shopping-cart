const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (req.session.token) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (!user) {
        console.log(err)
        return res.redirect('/users/login')
      }
      req.user = user.toJSON()
      console.log('---auth---user', req.user)
      res.locals.isAuthenticated = req.isAuthenticated()
      res.locals.user = req.user
      return next()
    })(req, res, next)
  } else {
    return next()
  }
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
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.user = req.user
    return next()
  })(req, res, next)
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
