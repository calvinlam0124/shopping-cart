const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
// const MemcachedStore = require('connect-memcached')(session)
const cors = require('cors')

// memcached
const memcached = require('memcached')
const cache = new memcached('localhost:11211')

// .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT || 3000

// set cors
app.use(cors())

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
  secret: process.env.SESSION_SECRET,
  resave: false,
  // resave: true,
  saveUninitialized: true,
  // saveUninitialized: false,
  // cookie: { maxAge: 100 * 60 * 60 * 24 },
  // store: new MemcachedStore({
    // hosts: ['127.0.0.1:11211'],
    // checkPeriod: 100 * 60 * 60 * 24 // 24hr
  // })
}))

// set connect-flash
app.use(flash())

// put token in req.headers by using memcached
app.use((req, res, next) => {
  cache.get('token', (err, value) => {
    if (err) {
      return next(err)
    }
    if (value) {
      console.log('===value===', value)
      req.headers.authorization = `Bearer ${value}`
      return next()
    }
    cache.end()
    return next()
  })
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
    console.log('500 error: ', err)
    return res.render('error', { err })
  }
})

app.listen(PORT, () => {
  console.log(`Express app is running on localhost:${PORT}`)
})
