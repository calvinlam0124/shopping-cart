'use strict'

const faker = require('faker')
const db = require('../models')
const Order = db.Order

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orders = await Order.findAll()

    await queryInterface.bulkInsert('Payments',
      Array.from({ length: 5 }).map((item, index) => ({
        OrderId: orders[Math.floor(Math.random() * 2)].id,
        amount: faker.datatype.number(),
        sn: faker.datatype.number(),
        payment_method: Math.floor(Math.random() * 3) + 1,
        paid_at: new Date(),
        params: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Payments', null, {})
  }
}
