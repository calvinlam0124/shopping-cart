const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT

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

// require routes
require('./routes')(app)

app.listen(PORT, () => {
  console.log(`Express app is running on localhost:${PORT}`)
})
