"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      hours: {
        allowNull: false,
        type: Sequelize.STRING
      },
      payment_type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      unit_price: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      total: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "projects",
          key: "id"
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("tasks");
  }
};
