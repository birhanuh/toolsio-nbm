import mongoose from 'mongoose'
import Project from './Project'

let taskSchema = new mongoose.Schema({
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  name: { type: String, required: true },
  hours: { type: Number, min: 1, max: 8, required: true },
  payment_type: { type: String, required: true },
  price: { type: Number, required: true },
  vat: { type: Number, min: 1, max: 100, required: true },

  created_at: Date,
  updated_at: Date
})

taskSchema.post('save', function(doc, next) {
  // Update related Project after saving Task
  Project.findByIdAndUpdate(this._creator, { $push: { tasks: this._id} }, { new: true }, function(err, project) {
    if (err) {
      errors: {
        cant_update_project: {
          message: err
        } 
      }
    }
  })

  next()
})

let Task = module.exports = mongoose.model('Task', taskSchema)