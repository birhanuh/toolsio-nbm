export default (sequelize, DataTypes) => {
  const Account = sequelize.define('accounts', {
    subdomain: {
      type: DataTypes.STRING,
      allowNull : false,
      unique: true,
      validate: {    
        is: ["^[a-z]+$",'i'],     // will only allow letters
        notContains: 'www' // don't allow www substrings
      } 
    },
    industry: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {     
        isAlpha: true  // will only allow letters
      } 
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        is: /\d{6,14}/,  // checks for phone format with RegExp) 
      },
      field: 'phone_number'
    },
    email: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        isEmail: true // checks for email format (foo@bar.com) 
      } 
    },
    street: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        isAlpha: true  // will only allow letters
      } 
    },
    postalCode: {
      type: DataTypes.DECIMAL,
      allowNull : true,
      validate: {     
        isDecimal: true // checks for any numbers
      },
      field: 'postal_code' 
    },
    region: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        isAlpha: true  // will only allow letters
      } 
    },
    country: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        isAlpha: true  // will only allow letters
      } 
    },
    logoUrl: {
      type: DataTypes.STRING,
      field: 'logo_url'
    }
  }, {
    hooks: {
      beforeValidate: (account, options) => {
        if (account.phoneNumber === "") {
          account.phoneNumber = null
        }
        if (account.email === "") {
          account.email = null
        }
        if (account.street === "") {
          account.street = null
        }
        if (account.postalCode === "") {
          account.postalCode = null
        }
        if (account.region === "") {
          account.region = null
        }
        if (account.country === "") {
          account.country = null
        }
      }
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