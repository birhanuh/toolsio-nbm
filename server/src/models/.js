'use strict';
module.exports = (sequelize, DataTypes) => {
  var = sequelize.define('', {
    deadline: DataTypes.DATE,
    paymentTerm: DataTypes.INTEGER,
    interestInArrears: DataTypes.INTEGER,
    status: DataTypes.STRING,
    referenceNumber: DataTypes.STRING,
    description: DataTypes.TEXT,
    total: DataTypes.INTEGER,
    customerId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER,
    saleId: DataTypes.INTEGER
  }, {
    underscored: true,
  });.associate = function(models) {
    // associations can be defined here
  };
  return;
};