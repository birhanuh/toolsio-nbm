import mongoose from 'mongoose'
import Sale from './Sale'

let itemSchema = new mongoose.Schema({
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: "Sale" },
  name: { type: String, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  vat: { type: Number, min: 1, max: 100, required: true },

  created_at: Date,
  updated_at: Date
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

let Item = module.exports = mongoose.model('Item', itemSchema)

