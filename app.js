const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')

// .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT || 3000

// set view engine
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/hbs-helpers')
}))
app.set('view engine', 'hbs')

// set bodyParser
app.use(bodyParser.urlencoded({ extended: true }))

// set methodOverride
app.use(methodOverride('_method'))

// set session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
  // cookie: { maxAge: 80000 }
}))

// set connect-flash
app.use(flash())

// put token in req.headers
app.use('*', (req, res, next) => {
  console.log('**********************')
  console.log('**token***', req.session.token)
  if (req.session.token) {
    req.headers['authorization'] = `Bearer ${req.session.token}`
    return next()
  }
  return next()
})

// flash message
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.danger_msg = req.flash('danger_msg')
  return next()
})

// require routes
require('./routes')(app)

// error handling
app.use((err, req, res, next) => {
  if (err) {
    res.status(500)
    return res.render('error', { err })
  }
})

app.listen(PORT, () => {
  console.log(`Express app is running on localhost:${PORT}`)
})
