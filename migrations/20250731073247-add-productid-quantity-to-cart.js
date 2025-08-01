'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // await queryInterface.addColumn('Carts', 'ProductId', {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'Products',
    //     key: 'id'
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'CASCADE'
    // });

    await queryInterface.addColumn('Carts', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Carts', 'ProductId');
    await queryInterface.removeColumn('Carts', 'quantity');
  }
};
