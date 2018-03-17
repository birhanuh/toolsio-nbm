export default (sequelize, DataTypes) => {
  const Account = sequelize.define('accounts', {
    subdomain: {
      type: DataTypes.STRING,
      allowNull : false,
      unique: true,
      validate: {     
        not: /\A[\w\-]+\Z/i, // contains invalid characters
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
    postalCode: {
      type: DataTypes.DECIMAL,
      field: 'postal_code',
      validate: {     
        isDecimal: true // checks for any numbers
      } 
    },
    region: DataTypes.STRING,
    country: DataTypes.STRING,
    logoUrl: {
      type: DataTypes.STRING,
      field: 'logo_url'
    }
  })

  Account.associate = function(models) {
    // 1:1
    Account.belongsTo(models.User, {
      foreignKey: 'owner'
    })
  }

  return Account
}