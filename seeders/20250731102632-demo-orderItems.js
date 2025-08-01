'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('OrderItems', [
      {
        OrderId: 1,
        ProductId: 1,
        quantity: 2,
        priceAtPurchase: 100000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        OrderId: 1,
        ProductId: 2,
        quantity: 1,
        priceAtPurchase: 100000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        OrderId: 2,
        ProductId: 2,
        quantity: 1,
        priceAtPurchase: 150000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('OrderItems', null, {});
  }
};
