'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('channels',
      {
        id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          allowNull: false
        },
        channelId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'channels',
            key: 'id'
          },
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('channels')
  }
};
