export default (sequelize, DataTypes) => {
  const Customer = sequelize.define('customers', {
    name: { 
      type: DataTypes.STRING,
      allowNull : false,
      validate: {     
        is: /^([^0-9]*)$/            /// will not allow numbers
      } 
    },
    vatNumber: {
      type: DataTypes.DECIMAL,
      unique: true,
      allowNull : false,
      validate: {     
        isDecimal: true // checks for any numbers
      },
      field: 'vat_number'
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        isNumeric: {
          arg: true, // will only allow numbers
          msg: "Wrong phone number format"
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
    isContactIncludedInInvoice: {
      type: DataTypes.BOOLEAN,
      defaultValue : false,
      allowNull : false,
      field: 'is_contact_included_in_invoice'
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {     
        is: /^[a-zA-Z0-9 ]+$/      // checks for letter, numbers, spaces with RegExp
      } 
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {     
        isNumeric: {
          arg: true,      // will only allow numbers,
          msg: 'Wrong postal code format'
        }
      },
      field: 'postal_code'
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {     
        isAlpha: {
          arg: true,  // will only allow letters
          msg: 'Wrong country format'
        }
      } 
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {     
        isAlpha: {
          arg: true,            // will only allow letters
          msg: 'Wrong country format'
        }
      } 
    }
  }, {
    hooks: {
      beforeValidate: (customer) => {
        if (customer.email === "" && customer.phoneNumber === "") {

          const type = 'Validation error'
          const value = ''
          const emailError = new sequelize.ValidationErrorItem("Either email or phone number is required", type, "email", value)
          const phoneNumberError = new sequelize.ValidationErrorItem("Either email or phone number is required", type, "phoneNumber", value)
          
          // Throw error  
          throw new sequelize.ValidationError('', [emailError, phoneNumberError])
        }
        if (customer.phoneNumber === "") {
          customer.phoneNumber = null
        }
        if (customer.email === "") {
          customer.email = null
        }
        if (customer.street === "") {
          customer.street = null
        }
        if (customer.postalCode === "") {
          customer.postalCode = null
        }
        if (customer.region === "") {
          customer.region = null
        }
        if (customer.country === "") {
          customer.country = null
        }
      }
    }
  })

  Customer.associate = (models) => {
    // 1:M
    Customer.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    })
  }

  return Customer
}
