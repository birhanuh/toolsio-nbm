var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// User Schema 
let SaleSchema = new mongoose.Schema({
  customer: { type: ObjectId, required: true },
  name: { type: String, required: true },
  date: { type: Date, default: Date.now required: true },
  status: { type: String, default: 'NEW' required: true },
  description: { type: String, default: '' },
  items: [items]
})

items.methods.addItems = function(items) {
  this.items.push(items)
}

let Sale = module.exports = mongoose.model('Sale', SaleSchema)