export default (sequelize, DataTypes) => {
  const Customer = sequelize.define('customers', {
    name: { 
      type: DataTypes.STRING,
      allowNull : false,
      validate: {    
        notEmpty: true,      
        is: /[A-Za-z\u00C0-\u00FF ]+/           // Unicode regx, will only allow letters, spaces
      } 
    },
    vatNumber: {
      type: DataTypes.DECIMAL,
      unique: true,
      allowNull : false,
      validate: {     
        isDecimal: true             // checks for any numbers
      },
      field: 'vat_number'
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull : true,
      validate: {     
        is: /^[0-9#+\-()]+$/        // will only allow numbers and special characters
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
        is: /^[a-zA-Z0-9 ]+$/       // checks for letter, numbers, spaces
      } 
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {     
        is: /^[0-9\-()]+$/,         // will only allow letters, dashes
      },
      field: 'postal_code'
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {     
        is: /[A-Za-z\u00C0-\u00FF ]+/           // Unicode regx, will only allow letters, spaces
      } 
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {     
        is: /[A-Za-z\u00C0-\u00FF ]+/           // Unicode regx, will only allow letters, spaces
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
        field: 'user_id',
        allowNull: false
      }
    })
  }

  return Customer
}
