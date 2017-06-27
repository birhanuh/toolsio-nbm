import mongoose from 'mongoose'

let itemSchema = new Schema({
  name: { type: String,required: true },
  date: { type: Date, required: true },
  unit: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  vat: { type: Number, min: 1, max: 100, required: true }
})

let Task = module.exports = mongoose.model('Task', taskSchema)