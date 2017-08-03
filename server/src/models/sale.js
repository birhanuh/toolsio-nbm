import mongoose from 'mongoose'

let items = []

// User Schema 
let saleSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required."] },
  deadline: { type: Date, required: [true, "Deadline is required."] },  
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: [true, "Customer is required."] },
  status: { type: String, default: "NEW" },
  description: { type: String, default: '' },
  items: { type: [items], required: false }
})

saleSchema.methods.addItems = function(items) {
  this.items.push(items)
}

let Sale = module.exports = mongoose.model('Sale', saleSchema)