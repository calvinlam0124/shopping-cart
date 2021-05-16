'use strict'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {})
  User.associate = function (models) {
    // define association here
    User.hasMany(models.Order)
  }
  return User
}
