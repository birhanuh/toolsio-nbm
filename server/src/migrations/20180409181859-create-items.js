'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('items', {
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
      unit: {
        allowNull : false,
        type: Sequelize.STRING
      },
      quantity: {
        allowNull : false,
        type: Sequelize.INTEGER
      },
      unit_price: {
        allowNull : false,
        type: Sequelize.DECIMAL
      },
      total: {
        allowNull : false,
        type: Sequelize.DECIMAL
      },
      sale_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sales',
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
    return queryInterface.dropTable('items');
  }
};