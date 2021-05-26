const db = require('../models')
const User = db.User

const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  try {
    const user = await User.findByPk(jwt_payload.id)
    if (!user) {
      return next(null, false)
    }
    return next(null, user)
  } catch (e) {
    console.log(e)
    return next(e, false)
  }
})

passport.use(strategy)

module.exports = passport
