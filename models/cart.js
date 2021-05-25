'use strict'

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    UserId: DataTypes.INTEGER
  }, {})
  Cart.associate = function (models) {
    // define association here
    Cart.belongsToMany(models.Product, {
      through: {
        model: models.CartItem,
        unique: false
      },
      foreignKey: 'CartId',
      as: 'cartProducts'
    })
  }
  return Cart
}
