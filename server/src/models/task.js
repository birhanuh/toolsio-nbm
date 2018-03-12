// import bookshelf from '../../db/bookshelf'

// export default bookshelf.Model.extend({
  
//   tableName: 'tasks',

//   project: function() {
//     return this.belongsTo('Project', 'project_id');
//   }

// }, { dependents: ['projects']});

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
