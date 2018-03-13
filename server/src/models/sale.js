export default (sequelize, DataTypes) => {
  const Sale = sequelize.define('sales', {
    name: {
      type: DataTypes.STRING,
      allowNull : false
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
      validate: {     
        isAlpha: true  // will only allow letters
      } 
    },
    description: DataTypes.TEXT,
    total: {
      type: DataTypes.INTEGER,
      allowNull : false,
      validate: {     
        isInt: true // checks for int
      } 
    }
  })

  Sale.associate = (models) => {
    // 1:M
    Sale.belongsTo(models.Customer, {
      foreignKey: {
        name: 'customerId',
        field: 'customer_id'
      }
    })

    // 1:1
    Sale.belongsTo(models.Invoice, {
      foreignKey: 'invoice_id'
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

