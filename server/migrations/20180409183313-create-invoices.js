"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("invoices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deadline: {
        type: Sequelize.DATE
      },
      payment_term: {
        type: Sequelize.INTEGER
      },
      interest_in_arrears: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: false,
        defaultValue: "new",
        type: Sequelize.STRING
      },
      reference_number: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      tax: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.DECIMAL
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "customers",
          key: "id"
        }
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "projects",
          key: "id"
        }
      },
      sale_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "sales",
          key: "id"
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
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
  down: queryInterface => {
    return queryInterface.dropTable("invoices");
  }
};
