'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('channel_messages', 'upload_path', {
        type: Sequelize.STRING }),
      queryInterface.addColumn('channel_messages', 'mimetype', {
        type: Sequelize.STRING }),
      queryInterface.addColumn('direct_messages', 'upload_path', {
        type: Sequelize.STRING }),
       queryInterface.addColumn('direct_messages', 'mimetype', {
        type: Sequelize.STRING })
    ];
  },

  down: (queryInterface) => {
    return [
      queryInterface.removeColumn('channel_messages', 'upload_path'),
      queryInterface.removeColumn('direct_messages', 'upload_path'),
      queryInterface.removeColumn('channel_messages', 'mimetype'),
      queryInterface.removeColumn('direct_messages', 'mimetype')
    ];
  }
};
