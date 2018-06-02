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
      first_name: {
        notEmpty: false,
        type: Sequelize.STRING
      },
      last_name: {
        notEmpty: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      avatar_url: {
        type: Sequelize.STRING
      },
      is_confirmed: {
        defaultValue: false,
        allowNull : false,
        type: Sequelize.BOOLEAN
      },
      is_admin: {
        defaultValue: false,
        allowNull : false,
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {underscored: true});
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('users');
  }
};