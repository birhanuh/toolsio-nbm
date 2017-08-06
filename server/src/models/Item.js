import mongoose from 'mongoose'

let itemSchema = new mongoose.Schema({
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: "Sale" },
  name: { type: String,required: true },
  unit: { type: Number, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  vat: { type: Number, min: 1, max: 100, required: true },

  created_at: Date,
  updated_at: Date
})

let Task = module.exports = mongoose.model('Task', taskSchema)