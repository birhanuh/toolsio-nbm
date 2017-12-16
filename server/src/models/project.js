import mongoose from 'mongoose' 

import Customer from'./customer'

const projectSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required."] },
  deadline: { type: Date, required: [true, "Deadline is required."] },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "customer", required: [true, "Customer is required."] },
  status: { type: String, required: [true, "Status is required."] },
  description: { type: String, default: '' },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }],
  total: { type: Number, default: 0 },

  invoice: { type: mongoose.Schema.Types.ObjectId, ref: "invoice" },

  createdAt: { type: Date },
  updatedAt: { type: Date }
})

projectSchema.pre('validate', function (next) {
  this.status = "new"
  next()
}) 

projectSchema.post('save', function(doc, next) {

  // Push project to related Customer object
  Customer.findByIdAndUpdate(this.customer, { $push: { projects: this._id }}, { new: true }, (err, customer) => {
    if (err) {
      errors: {
        cantUpdateCustomer: {
          message: err
        } 
      }
    }
  })

  next()
})

module.exports = mongoose.model('project', projectSchema)
