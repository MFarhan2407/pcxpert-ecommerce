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
    const users = await queryInterface.sequelize.query(`SELECT id FROM "Users" LIMIT 1;`);
    const products = await queryInterface.sequelize.query(`SELECT id, price FROM "Products" LIMIT 3;`);

    const userId = users[0][0]?.id;
    const selectedProducts = products[0];

    let totalPrice = 0;
    const orderItems = selectedProducts.map((prod, i) => {
      const quantity = i + 1;
      totalPrice += prod.price * quantity;
      return {
        ProductId: prod.id,
        quantity,
        priceAtPurchase: prod.price,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    await queryInterface.bulkInsert('Orders', [{
      UserId: userId,
      totalPrice,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    const orders = await queryInterface.sequelize.query(`SELECT id FROM "Orders" ORDER BY "createdAt" DESC LIMIT 1;`);
    const orderId = orders[0][0].id;

    orderItems.forEach(item => item.OrderId = orderId);

    await queryInterface.bulkInsert('OrderItems', orderItems, {});

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('OrderItems', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
