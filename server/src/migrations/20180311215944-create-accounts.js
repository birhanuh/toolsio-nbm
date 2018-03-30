'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subdomain: {
        allowNull: false,
        unique: true,
        type: Sequelize.UUID
      },
      industry: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.STRING
      },
      postal_code: {
        type: Sequelize.STRING
      },
      region: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      logo_url: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('accounts');
  }
};