'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.renameColumn('messages',
        'message', 'body'),
      queryInterface.renameColumn('direct_messages', 
        'message', 'body')
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.renameColumn('messages', 
        'body', 'message'),
      queryInterface.renameColumn('direct_messages', 
        'body', 'message')
    ]
  }
};
