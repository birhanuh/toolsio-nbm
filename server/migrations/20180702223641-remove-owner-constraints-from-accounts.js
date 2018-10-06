'use strict';

module.exports = {
  up: (queryInterface) => {
    queryInterface.removeConstraint('accounts', 'accounts_owner_fkey')
  },

  down: (queryInterface) => {
    queryInterface.addConstraint('accounts', 'accounts_owner_fkey')
  }
};
