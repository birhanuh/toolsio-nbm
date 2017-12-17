import mongoose from 'mongoose'
import Project from './project'

const taskSchema = new mongoose.Schema({
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
  name: { type: String, required: [true, "Name is required."] },
  hours: { type: Number, min: 1, max: 8, required: [true, "Hours is required."] },
  paymentType: { type: String, required: [true, "Payment type is required."] },
  price: { type: Number, required: [true, "Price is required."] },
  vat: { type: Number, min: 1, max: 100, required: [true, "Vat is required."] }
},{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp. 
})

taskSchema.post('save', (doc, next) => {
  
  // Push task and increment total value to related Project object
  Project.findByIdAndUpdate(this._creator, { $push: { tasks: this._id}, $inc: {total: this.price} }, { new: true }, (err, project) => {
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

module.exports = mongoose.model('task', taskSchema)