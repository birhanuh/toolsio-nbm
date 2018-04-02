'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        notEmpty: false,
        type: Sequelize.STRING
      },
      lastName: {
        notEmpty: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.UUID
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      avatarUrl: {
        type: Sequelize.STRING
      },
      isConfirmed: {
        defaultValue: false,
        allowNull : false,
        type: Sequelize.BOOLEAN
      },
      isAdmin: {
        defaultValue: false,
        allowNull : false,
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('users');
  }
};