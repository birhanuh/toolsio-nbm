"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "direct_messages",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        body: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        is_read: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        receiver_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "users",
            key: "id"
          }
        },
        sender_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "users",
            key: "id"
          }
        }
      },
      {
        indexes: [{ fields: ["created_at"] }]
      }
    );
  },
  down: queryInterface => {
    return queryInterface.dropTable("direct_messages");
  }
};
