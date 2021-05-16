'use strict'

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
  }, {})
  Cart.associate = function (models) {
    // define association here
    Cart.belongsToMany(models.Product, {
      through: models.CartItem,
      foreignKey: 'CartId',
      as: 'cartProducts'
    })
  }
  return Cart
}
