"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("channel_messages", "body", {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn("direct_messages", "body", {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("channel_messages", "body", {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.changeColumn("direct_messages", "body", {
        type: Sequelize.STRING,
        allowNull: false
      })
    ]);
  }
};
