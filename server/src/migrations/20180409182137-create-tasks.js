'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
         allowNull : false,
        type: Sequelize.STRING
      },
      hours: {
         allowNull : false,
        type: Sequelize.STRING
      },
      paymentType: {
         allowNull : false,
        type: Sequelize.STRING
      },
      price: {
         allowNull : false,
        type: Sequelize.DECIMAL
      },
      vat: {
        type: Sequelize.INTEGER
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'projects',
          key: 'id'
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tasks');
  }
};