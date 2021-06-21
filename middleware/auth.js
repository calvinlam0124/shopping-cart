const passport = require('../config/passport')

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      console.log(err)
      req.flash('warning_msg', 'JWT驗證未通過!')
      return res.redirect('/admin/login')
    }
    if (user.role !== 'admin') {
      req.flash('danger_msg', '權限不足!')
      return res.redirect('/admin/login')
    }
    res.locals.user = req.user
    res.locals.isAuthenticated = req.isAuthenticated()
    return next()
  })(req, res, next)
}

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      console.log(err)
      req.flash('warning_msg', 'JWT驗證未通過!')
      return res.redirect('/users/login')
    }
    res.locals.user = req.user
    res.locals.isAuthenticated = req.isAuthenticated()
    // res.locals.token = req.session.token
    // console.log('---req.session.token--', req.session.token)
    return next()
  })(req, res, next)
}

module.exports = {
  authenticatedAdmin,
  authenticated
}
