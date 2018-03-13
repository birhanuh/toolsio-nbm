export default (sequelize, DataTypes) => {
  const Sale = sequelize.define('sales', {
    name: {
      type: DataTypes.STRING,
      allowNull : false
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull : false
    },
    status: {
      type: DataTypes.STRING,
      allowNull : false
    },
    description: DataTypes.TEXT,
    total: {
      type: DataTypes.INTEGER,
      allowNull : false
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

