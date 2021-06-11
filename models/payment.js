'use strict'

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    OrderId: DataTypes.INTEGER,
    payment_method: DataTypes.STRING,
    isSuccess: DataTypes.BOOLEAN,
    paid_at: DataTypes.DATE
  }, {})
  Payment.associate = function (models) {
    // define association here
    Payment.belongsTo(models.Order)
  }
  return Payment
}
