import mongoose from 'mongoose'
import Sale from './sale'

let itemSchema = new mongoose.Schema({
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: "sale" },
  name: { type: String, required: [true, "Name is required."] },
  unit: { type: String, required: [true, "Unit is required."] },
  quantity: { type: Number, required: [true, "Quantity is required."] },
  price: { type: Number, required: [true, "Price is required."] },
  vat: { type: Number, min: 1, max: 100, required: [true, "Vat is required."] },

  createdAt: Date,
  updatedAt: Date
})

itemSchema.post('save', function(doc, next) {
  // Update related Project after saving Task
  Sale.findByIdAndUpdate(this._creator, { $push: { items: this._id} }, { new: true }, function(err, sale) {
    if (err) {
      errors: {
        cant_update_sale: {
          message: err
        } 
      }
    }
  })

  next()
})

let Item = module.exports = mongoose.model('item', itemSchema)

