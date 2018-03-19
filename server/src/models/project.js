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
      validate: {     
        isAlpha: true  // will only allow letters
      } 
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull : true,
      validate: {    
        isDecimal: true // checks for any numbers
      } 
    },
    description: DataTypes.TEXT,
    total: {
      type: DataTypes.INTEGER,
      allowNull : true,
      validate: {     
        isInt: true // checks for int
      } 
    }
  }, {
    hooks: {
      beforeValidate: (project, options) => {
        if (project.progress === "") {
          project.progress = null
        }
        if (project.total === "") {
          project.total = null
        }
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
