'use strict';
module.exports = (sequelize, DataTypes) => {
  var accounts = sequelize.define('accounts', {
    subdomain: DataTypes.STRING,
    industry: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    email: DataTypes.STRING,
    street: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    region: DataTypes.STRING,
    country: DataTypes.STRING,
    logo_url: DataTypes.STRING
  }, {});
  accounts.associate = function(models) {
    // associations can be defined here
  };
  return accounts;
};