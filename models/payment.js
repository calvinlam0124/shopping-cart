'use strict'

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    OrderId: DataTypes.INTEGER,
    sn: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    payment_method: DataTypes.STRING,
    paid_at: DataTypes.DATE,
    params: DataTypes.TEXT
  }, {})
  Payment.associate = function (models) {
    // define association here
    Payment.belongsTo(models.Order)
  }
  return Payment
}
