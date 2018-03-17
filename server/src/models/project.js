export default (sequelize, DataTypes) => {
  const Project = sequelize.define('projects', {
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
      validate: {     
        isInt: true // checks for int
      } 
    }
  })

  Project.associate = (models) => {
    // 1:M
    Project.belongsTo(models.Customer, {
      foreignKey: {
        name: 'customerId',
        field: 'customer_id'
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
