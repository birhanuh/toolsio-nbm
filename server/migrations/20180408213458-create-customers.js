"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("customers", {
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
      vat_number: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      phone_number: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      is_contact_included_in_invoice: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable("customers");
  }
};
