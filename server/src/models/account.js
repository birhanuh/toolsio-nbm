export default (sequelize, DataTypes) => {
  const Account = sequelize.define('accounts', {
    subdomain: {
      type: DataTypes.STRING,
      allowNull : false,
      unique: true
    },
    industry: {
      type: DataTypes.STRING,
      allowNull : false
    },
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    street: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    region: DataTypes.STRING,
    country: DataTypes.STRING,
    logoUrl: DataTypes.STRING
  }, {underscored: true})

  Account.associate = function(models) {
    // 1:M
    Account.belongsTo(models.User, {
      foreignKey: 'owner'
    })
  }

  return Account
}