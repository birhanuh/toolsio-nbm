export default (sequelize, DataTypes) => {
  const Sale = sequelize.define('sales', {
    name: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {     
        notEmpty: true, // don't allow empty strings
      } 
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull : false,
      validate: {     
        isDate: true, // only allow date strings
      } 
    },
    status: {
      type: DataTypes.STRING,
      allowNull : false,
      defaultValue : "new",
      validate: {     
        isAlpha: true  // will only allow letters
      } 
    },
    description: DataTypes.TEXT,
    total: {
      type: DataTypes.INTEGER,
      allowNull : true,
      defaultValue : 0,
      validate: {    
        isInt: true // checks for int
      } 
    }
  })

  Sale.associate = (models) => {
    // 1:N
    Sale.belongsTo(models.Customer, {
      foreignKey: {
        name: 'customerId',
        field: 'customer_id'
      }
    })

  }

  return Sale
}


// saleSchema.post('save', function(doc, next) {

//   // Push sale to related Customer object
//   Customer.findByIdAndUpdate(this.customer, { $push: { sales: this._id }}, { new: true }, (err, customer) => {
//     if (err) {
//       errors: {
//         cantUpdateCustomer: {
//           message: err
//         } 
//       }
//     }
//   })

//   next()
// })

