'use strict'

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    UserId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    sn: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    shipping_status: DataTypes.STRING,
    payment_status: DataTypes.STRING
  }, {})
  Order.associate = function (models) {
    // define association here
    Order.belongsTo(models.User)
    Order.hasMany(models.Payment)
    Order.belongsToMany(models.Product, {
      through: {
        model: models.OrderItem,
        unique: false
      },
      foreignKey: 'OrderId',
      as: 'orderProducts'
    })
  }
  return Order
}
