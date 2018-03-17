export default (sequelize, DataTypes) => {
  const Task = sequelize.define('tasks', {
    name: {
      type: DataTypes.STRING,
      allowNull : false
    },
    hours: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {     
        isAlpha: true // will only allow letters
      } 
    },
    paymentType: {
      type: DataTypes.STRING,
      allowNull : false,
      field: 'payment_type',
      validate: {     
        isAlpha: true // will only allow letters
      } 
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
      validate: {     
        isInt: true, // checks for int
      } 
    }
  })

  Task.associate = (models) => {
    // 1:N
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
