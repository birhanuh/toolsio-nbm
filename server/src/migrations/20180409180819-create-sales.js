'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sales', {
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
      total: {      
        allowNull : false,          
        defaultValue: 0,
        type: Sequelize.DECIMAL
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id'
        },
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sales');
  }
};