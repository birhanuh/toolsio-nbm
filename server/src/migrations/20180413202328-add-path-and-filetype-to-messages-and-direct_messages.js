'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('messages', 'path', {
        type: Sequelize.STRING }),
      queryInterface.addColumn('messages', 'type', {
        type: Sequelize.STRING }),
      queryInterface.addColumn('direct_messages', 'path', {
        type: Sequelize.STRING }),
      queryInterface.addColumn('direct_messages', 'type', {
        type: Sequelize.STRING })

    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('messages', 'path'),
      queryInterface.removeColumn('messages', 'type'),
      queryInterface.removeColumn('direct_messages', 'path'),
      queryInterface.removeColumn('direct_messages', 'type')
    ];
  }
};
