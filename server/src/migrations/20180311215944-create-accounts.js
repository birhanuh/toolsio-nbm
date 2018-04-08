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
        type: Sequelize.STRING
      },
      industry: {
        allowNull : false,
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.STRING
      },
      postalCode: {
        type: Sequelize.STRING
      },
      region: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      logoUrl: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      owner: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('accounts');
  }
};