import mongoose from 'mongoose'
import Project from './project'

let taskSchema = new mongoose.Schema({
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
  name: { type: String, required: [true, "Name is required."] },
  hours: { type: Number, min: 1, max: 8, required: [true, "Hours is required."] },
  paymentType: { type: String, required: [true, "Payment type is required."] },
  price: { type: Number, required: [true, "Price is required."] },
  vat: { type: Number, min: 1, max: 100, required: [true, "Vat is required."] },

  createdAt: Date,
  updatedAt: Date
})

taskSchema.post('save', function(doc, next) {
  // Update related Project after saving Task
  Project.findByIdAndUpdate(this._creator, { $push: { tasks: this._id} }, { new: true }, function(err, project) {
    if (err) {
      errors: {
        cantUpdateProject: {
          message: err
        } 
      }
    }
  })

  next()
})

let Task = module.exports = mongoose.model('task', taskSchema)