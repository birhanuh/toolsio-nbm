export default (sequelize, DataTypes) => {
  const Task = sequelize.define('tasks', {
    name: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {     
        notEmpty: true, // don't allow empty strings
      } 
    },
    hours: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {     
        notEmpty: true, // don't allow empty strings
      } 
    },
    paymentType: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {     
        notEmpty: true, // don't allow empty strings
      },
      field: 'payment_type'
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull : false,
      validate: {     
        isDecimal: true // checks for any numbers
      } 
    },
    vat: {
      type: DataTypes.INTEGER,
      allowNull : true,
      validate: {     
        isInt: true // checks for int
      } 
    }
  }, {
    hooks: {
      beforeValidate: (task, options) => {
        if (task.vat === "") {
          task.vat = null
        }
      }
    }
  })

  Task.associate = (models) => {
    // 1:M
    Task.belongsTo(models.Project, {
      foreignKey: {
        name: 'projectId',
        field: 'project_id'
      }
    })
  }

  return Task
}

// taskSchema.post('save', function (doc, next) {

//   // Push task and increment total value to related Project object
//   Project.findByIdAndUpdate(this._creator, { $push: { tasks: this._id}, $inc: {total: this.price} }, { new: true }, (err, project) => {
//     if (err) {
//       errors: {
//         cantUpdateProject: {
//           message: err
//         } 
//       }
//     }
//   })

//   next()
// })
