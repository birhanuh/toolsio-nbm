'use strict';

module.exports = {
  up: (queryInterface) => {
    return [
      queryInterface.renameColumn('channel_messages',
        'message', 'body'),
      queryInterface.renameColumn('direct_messages', 
        'message', 'body')
    ]
  },

  down: (queryInterface) => {
    return [
      queryInterface.renameColumn('channel_messages', 
        'body', 'message'),
      queryInterface.renameColumn('direct_messages', 
        'body', 'message')
    ]
  }
};
