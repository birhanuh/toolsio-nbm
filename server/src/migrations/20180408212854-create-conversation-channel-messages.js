'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('channel_messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        allowNull : false,
        type: Sequelize.TEXT
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      channel_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'channels',
          key: 'id'
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
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
    }, {
      indexes: [
        { fields: ['created_at'] }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('channel_messages');
  }
};