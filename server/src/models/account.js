export default (sequelize, DataTypes) => {
  const Account = sequelize.define('accounts', {
    subdomain: {
      type: DataTypes.STRING,
      allowNull : false,
      unique: true,
      validate: {    
        is: ["^[a-z]+$",'i'],       // will only allow letters
        notIn: [['www', 'http', 'https', 'api']],          // don't allow www, http, https substrings
      } 
    },
    industry: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {     
        is: /^[A-Za-z / ]+$/       // will only allow letters and slashes with RegExp
      } 
    },
    currencyCode: {
      type: DataTypes.STRING,
      allowNull : false,
      defaultValue : "USD",
      validate: {     
        notEmpty: true  // don't allow empty strings
      },
      field: 'currency_code' 
    },
    companyId: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {       
        is: /^[0-9a-zA-Z#+\-()]+$/      // will only allow numbers, letters and special characters
      },
      field: 'company_id'
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {       
        is: /^[0-9#+\-()]+$/      // will only allow numbers and special characters
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
        is: /^[a-zA-Z0-9_ ]*$/      // will only allow letter, numbers, spaces
      } 
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {     
        is: /^[0-9\-()]+$/,         // will only allow numbers, dashes
      },
      field: 'postal_code'
    },
    region: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        is: /[A-Za-z\u00C0-\u00FF ]+/           // Unicode regx, will only allow letters, spaces
      } 
    },
    country: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {       
        is: /[A-Za-z\u00C0-\u00FF ]+/            // Unicode regx, will only allow letters, spaces
      } 
    },
    logoUrl: {
      type: DataTypes.STRING,
      field: 'logo_url'
    }
  }, {
    hooks: {
      beforeValidate: (account) => {
        if (account.companyId === "") {
          account.companyId = null
        }
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
      foreignKey: 'owner',
      allowNull: false,
      constraints: false
    })
  }

  return Account
}

