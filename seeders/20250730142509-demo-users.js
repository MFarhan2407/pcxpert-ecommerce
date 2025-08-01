'use strict';
const fs = require('fs').promises;
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'))

    data.forEach(user => {
      user.password = bcrypt.hashSync(user.password, 10);
      user.createdAt = new Date();
      user.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Users", data)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {})
  }
};
