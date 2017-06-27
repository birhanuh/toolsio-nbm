import mongoose from 'mongoose'

let taskSchema = new Schema({
  name: { type: String,required: true },
  date: { type: Date, required: true },
  hours: { type: Number, min: 1, max: 8, required: true },
  price_per_hour: { type: Number, required: true },
  vat: { type: Number, min: 1, max: 100, required: true }
})

let Task = module.exports = mongoose.model('Task', taskSchema)