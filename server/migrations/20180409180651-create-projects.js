'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('projects', {
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
      deadline: {
        allowNull : false,
        type: Sequelize.DATE
      },
      status: {
        allowNull : false,
        defaultValue: "new",
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      progress: {
        allowNull : false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      tax: {
        allowNull : true,
        defaultValue: 0,
        type: Sequelize.DECIMAL
      },
      is_invocied: {
        defaultValue: false,
        allowNull : false,
        type: Sequelize.BOOLEAN
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id'
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('projects');
  }
};