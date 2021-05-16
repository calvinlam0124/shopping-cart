'use strict'

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {})
  Product.associate = function (models) {
    // define association here
    Product.belongsToMany(models.Cart, {
      through: models.CartItem,
      foreignKey: 'ProductId',
      as: 'carts'
    })
    Product.belongsToMany(models.Order, {
      through: models.OrderItem,
      foreignKey: 'ProductId',
      as: 'orders'
    })
  }
  return Product
}
