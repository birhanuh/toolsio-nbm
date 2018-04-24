export default (sequelize, DataTypes) => {
  const Project = sequelize.define('projects', {
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
        notEmpty: true  // don't allow empty strings
      } 
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull : true,
      defaultValue : 0,
      validate: {    
        isDecimal: true // checks for any numbers
      } 
    },
    description: DataTypes.TEXT
  })

  Project.associate = (models) => {
    // 1:M
    Project.belongsTo(models.Customer, {
      foreignKey: {
        name: 'customerId',
        field: 'customer_id'
      }
    })

    // 1:M
    Project.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
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
