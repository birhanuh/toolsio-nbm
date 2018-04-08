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
        is: {
          arg: /^[A-Za-z \/ ]+$/,            // will only allow letters and slashes with RegExp,
          msg: 'Wrong industry format'
        }
      } 
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        is: {
          arg: /^(?=.*?[1-9])[0-9()-]+$/,  // checks for phone format with RegExp,
          msg: 'Wrong phone number format'
        }
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
        is: {
          arg: /^[A-Za-z ]+$/,            // will only allow letters and spaces with RegExp,
          msg: 'Wrong street format'
        }
      } 
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        is: {
          arg: /^(?=.*?[1-9])[0-9()-]+$/, // checks for numbers and special characters with RegExp,
          msg: 'Wrong postal code format'
        }
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
        is: {
          arg: /^[A-Za-z ]+$/,            // will only allow letters and spaces with RegExp,
          msg: 'Wrong country format'
        }
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