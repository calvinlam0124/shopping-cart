'use strict'

const faker = require('faker')
const db = require('../models')
const User = db.User

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' } })

    await queryInterface.bulkInsert('Orders',
      Array.from({ length: 2 }).map((item, index) => ({
        // id: index + 1,
        UserId: users[Math.floor(Math.random() * users.length)].id,
        name: faker.name.findName(),
        phone: faker.phone.phoneNumberFormat(),
        address: faker.address.streetAddress(),
        amount: faker.datatype.number(),
        sn: faker.datatype.number().toString(),
        shipping_status: Math.floor(Math.random() * 1),
        payment_status: Math.floor(Math.random() * 1),
        createdAt: new Date(),
        updatedAt: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', null, {})
  }
}
