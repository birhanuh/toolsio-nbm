'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.changeColumn('messages', 'message', {
        type: Sequelize.STRING,
        allowNull: true }),
      queryInterface.changeColumn('direct_messages', 'message', {
        type: Sequelize.STRING,
        allowNull: true })

    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
       queryInterface.changeColumn('messages', 'message', {
        type: Sequelize.STRING,
        allowNull: false }),
      queryInterface.changeColumn('direct_messages', 'message', {
        type: Sequelize.STRING,
        allowNull: false })
    ];
  }
};