var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

let items = []

// User Schema 
let saleSchema = new mongoose.Schema({
  customer: { type: ObjectId, required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true },
  description: { type: String, default: '' },
  items: { type: [items], required: true }
})

saleSchema.methods.addItems = function(items) {
  this.items.push(items)
}

let Sale = module.exports = mongoose.model('Sale', saleSchema)