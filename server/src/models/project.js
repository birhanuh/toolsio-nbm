export default (sequelize, DataTypes) => {
  const Project = sequelize.define('projects', {
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
    description: DataTypes.STRING,
    total: {
      type: DataTypes.INTEGER,
      allowNull : false
    }
  }, {underscored: true})

  Project.associate = (models) => {
    // 1:M
    Project.belongsTo(models.Customer, {
      foreignKey: {
        name: 'customerId',
        field: 'customer_id'
      }
    })

    // 1:1
    Project.belongsTo(models.Invoice, {
      foreignKey: {
        name: 'invoiceId',
        field: 'invoice_id'
      }
    })
  }

  return Project
}



// projectSchema.post('save', function(doc, next) {

//   // Push project to related Customer object
//   Customer.findByIdAndUpdate(this.customer, { $push: { projects: this._id }}, { new: true }, (err, customer) => {
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

// module.exports = mongoose.model('project', projectSchema)
