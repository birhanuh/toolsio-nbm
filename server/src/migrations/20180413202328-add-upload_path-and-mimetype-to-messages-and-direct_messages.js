'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('messages', 'upload_path', {
        type: Sequelize.STRING }),
      queryInterface.addColumn('messages', 'mimetype', {
        type: Sequelize.STRING }),
      queryInterface.addColumn('direct_messages', 'upload_path', {
        type: Sequelize.STRING }),
       queryInterface.addColumn('direct_messages', 'mimetype', {
        type: Sequelize.STRING })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('messages', 'upload_path'),
      queryInterface.removeColumn('direct_messages', 'upload_path'),
      queryInterface.removeColumn('messages', 'mimetype'),
      queryInterface.removeColumn('direct_messages', 'mimetype')
    ];
  }
};
