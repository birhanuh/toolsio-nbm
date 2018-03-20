export default (sequelize, DataTypes) => {
  const Customer = sequelize.define('customers', {
    name: { 
      type: DataTypes.STRING,
      allowNull : false,
      validate: {     
        isAlpha: true  // will only allow letters
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
      type: DataTypes.DECIMAL,
      allowNull : true,
      validate: {     
        isDecimal: true // checks for any numbers
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
      allowNull: true
    },
    postalCode: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      validate: {     
        isDecimal: true // checks for any numbers
      },
      field: 'postal_code'
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    hooks: {
      beforeValidate: (customer, options) => {
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

  }

  return Customer
}

// },
// {
//   daysBetween: ( date1, date2 ) => {
//     //Get 1 day in milliseconds
//     var one_day=1000*60*60*24;

//     // Convert both dates to milliseconds
//     var date1_ms = date1.getTime();
//     var date2_ms = date2.getTime();

//     // Calculate the difference in milliseconds
//     var difference_ms = date2_ms - date1_ms;
      
//     // Convert back to days and return
//     return Math.round(difference_ms/one_day); 
//   } 
// });

// //customerSchema.index({name: 'text', 'address.street': 'text', 'address.postalCode': 'text', 'address.region': 'text', 'address.country': 'text', 'contact.phoneNumber': 'text', 'contact.email': 'text'})

