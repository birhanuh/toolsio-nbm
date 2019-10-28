"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "invitations",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        email: {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING
        },
        is_invitation_accepted: {
          defaultValue: false,
          allowNull: false,
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
      },
      { underscored: true }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("invitations");
  }
};
