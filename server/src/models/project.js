// import bookshelf from '../../db/bookshelf'
// import Promise from 'bluebird'

// export default bookshelf.Model.extend({
  
//   tableName: 'projects',
  
//   tasks: function() {
//     return this.hasMany('Task', 'project_id');
//   },

//   invoice: function() {
//     return this.belongsTo('Invoice', 'invoice_id');
//   },

//   customer: function() {
//     return this.belongsTo('Customer', 'customer_id');
//   },

//   initialize: function() {
//     this.on('creating', this.setDefaultStatus);
//   },

//   setDefaultStatus: function(model, attrs, options) {
//     return new Promise(function(resolve, reject) {

//       let defaultStatus = 'new'
      
//       model.set('status', defaultStatus)
//       resolve(defaultStatus)       
//     })
//   }

// });



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
