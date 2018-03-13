export default (sequelize, DataTypes) => {
  const Customer = sequelize.define('customers', {
    name: { 
      type: DataTypes.STRING,
      allowNull : false
    },
    vat_number: {
      type: DataTypes.INTEGER,
      allowNull : false,
      unique: true
    },
    phone_number: DataTypes.STRING,
    email: DataTypes.STRING,
    is_contact_included_in_invoice: {
      type: DataTypes.BOOLEAN,
      allowNull : false
    },
    street: DataTypes.STRING,
    postal_code: DataTypes.INTEGER,
    region: DataTypes.STRING,
    country: DataTypes.STRING
  }, {underscored: true})

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

