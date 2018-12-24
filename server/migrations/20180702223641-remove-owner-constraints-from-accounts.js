"use strict";

module.exports = {
  up: queryInterface => {
    return Promise.resolve().then(() =>
      queryInterface.removeConstraint("accounts", "accounts_owner_fkey")
    );
  },

  down: queryInterface => {
    return Promise.resolve().then(() =>
      queryInterface.addConstraint("accounts", "accounts_owner_fkey")
    );
  }
};
