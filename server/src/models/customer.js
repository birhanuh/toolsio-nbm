export default (sequelize, DataTypes) => {
  const Customer = sequelize.define('customers', {
    name: { 
      type: DataTypes.STRING,
      allowNull : false
    },
    vatNumber: {
      type: DataTypes.INTEGER,
      allowNull : false,
      unique: true,
      field: 'vat_number',
      validate: {     
        isDecimal: true // checks for any numbers
      } 
    },
    phoneNumber: {
      type: DataTypes.STRING,
      field: 'phone_number',
      validate: {     
        is: /\d{6,14}/  // checks for phone format with RegExp) 
      } 
    },
    email: {
      type: DataTypes.STRING,
      validate: {     
        isEmail: true // checks for email format (foo@bar.com) 
      } 
    },
    isContactIncludedInInvoice: {
      type: DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : false,
      field: 'is_contact_included_in_invoice'
    },
    street: {
      type: DataTypes.STRING,
      validate: {     
        isDecimal: true // checks for any numbers
      } 
    },
    postal_code: DataTypes.INTEGER,
    region: DataTypes.STRING,
    country: DataTypes.STRING
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

