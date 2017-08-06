import mongoose from 'mongoose'

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

let Task = module.exports = mongoose.model('Task', taskSchema)