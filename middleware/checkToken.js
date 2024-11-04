// function checkToken (req, res, next, controller) {
//   if (req.session.token) {
//     return next()
//   } else {
//     controller(req, res, next)
//   }
// }

const memcached = require('memcached')
const cache = new memcached('host.docker.internal:11211')

function checkToken (req, res, next, controller) {
  cache.get('token', (err, value) => {
    if (err) {
      return next(err)
    }
    if (value) {
      console.log('---value---', value)
      return next()
    } else {
      cache.end()
      controller(req, res, next)
    }
  })
}

module.exports = checkToken
