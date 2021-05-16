const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('This is a shopping cart project.')
})

app.listen(PORT, () => {
  console.log(`Express app is running on localhost:${PORT}`)
})

const faker = require('faker')
console.log('======', faker.datatype.number)
console.log('------', faker.random.number)