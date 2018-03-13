export default (sequelize, DataTypes) => {
  const Task = sequelize.define('tasks', {
    name: {
      type: DataTypes.STRING,
      allowNull : false
    },
    hours: {
      type: DataTypes.STRING,
      allowNull : false
    },
    payment_type: {
      type: DataTypes.STRING,
      allowNull : false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull : false
    },
    vat: DataTypes.INTEGER,
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
