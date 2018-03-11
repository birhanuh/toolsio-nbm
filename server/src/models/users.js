'use strict';
module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define('users', {
    account: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STARING,
    password: DataTypes.STRING,
    avatar_url: DataTypes.STRING,
    is_confirmed: DataTypes.BOOLEAN,
    is_admin: DataTypes.BOOLEAN
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};