const express = require('express')
const exphbs = require('express-handlebars')

const app = express()
const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs({
  extname: '.hbs',
  helpers: require('./config/hbs-helpers')
}))
app.set('view engine', 'hbs')

require('./routes')(app)

app.listen(PORT, () => {
  console.log(`Express app is running on localhost:${PORT}`)
})
