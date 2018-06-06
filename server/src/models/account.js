export default (sequelize, DataTypes) => {
  const Account = sequelize.define('accounts', {
    subdomain: {
      type: DataTypes.STRING,
      allowNull : false,
      unique: true,
      validate: {    
        is: ["^[a-z]+$",'i'],     // will only allow letters
        notContains: 'www'        // don't allow www substrings
      } 
    },
    industry: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {     
        is: /^[A-Za-z \/ ]+$/     // will only allow letters and slashes with RegExp
      } 
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        isNumeric: {
          arg: true,              // will only allow numbers
          msg: 'Wrong phone number format'
        }
      },
      field: 'phone_number'
    },
    email: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        isEmail: true               // checks for email format (foo@bar.com) 
      } 
    },
    street: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        is: /^[a-zA-Z0-9_ ]*$/      // will only allow letter, numbers, spaces with RegExp,
      } 
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        is: /^[0-9- ]*$/             // will only allow numbers, spaces, dash characters with RegExp
      },
      field: 'postal_code' 
    },
    region: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        is: /^[a-zA-Z_ ]*$/          // will only allow letters, spaces  with RegExp
      } 
    },
    country: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {       
        is: /^[a-zA-Z_ ]*$/          // will only allow letters, spaces  with RegExp
      } 
    },
    logoUrl: {
      type: DataTypes.STRING,
      field: 'logo_url'
    }
  }, {
    hooks: {
      beforeValidate: (account) => {
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

