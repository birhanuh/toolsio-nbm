'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deadline: {
        type: Sequelize.DATE
      },
      paymentTerm: {
        type: Sequelize.INTEGER
      },
      interestInArrears: {
        allowNull : false,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull : false,
        defaultValue: "new",
        type: Sequelize.STRING
      },
      referenceNumber: {
        allowNull : false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      total: {
        allowNull : false,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id'
        },
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'projects',
          key: 'id'
        },
      },
      saleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sales',
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
    return queryInterface.dropTable('invoices');
  }
};