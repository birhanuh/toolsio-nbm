export default (sequelize, DataTypes) => {
  const Account = sequelize.define('accounts', {
    subdomain: {
      type: DataTypes.STRING,
      allowNull : false,
      unique: true,
      validate: {     
        is: /\A[\w\-]+\Z/i, // contains invalid characters
        notContains: 'www' // don't allow www substrings
      } 
    },
    industry: {
      type: DataTypes.STRING,
      allowNull : false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      field: 'phone_number',
      validate: {     
        is: /\d{6,14}/,  // checks for phone format with RegExp) 
      } 
    },
    email: DataTypes.STRING,
    street: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    region: DataTypes.STRING,
    country: DataTypes.STRING,
    logoUrl: DataTypes.STRING
  })

  Account.associate = function(models) {
    // 1:M
    Account.belongsTo(models.User, {
      foreignKey: 'owner'
    })
  }

  return Account
}