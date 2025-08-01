'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'ProductId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'ProductId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
