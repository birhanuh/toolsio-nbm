"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("accounts", {
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
        allowNull: false,
        type: Sequelize.STRING
      },
      currency_code: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "USD"
      },
      company_id: {
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      owner: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        }
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable("accounts");
  }
};
