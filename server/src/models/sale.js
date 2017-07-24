var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

let items = []

// User Schema 
let saleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deadline: { type: Date, required: true },  
  customer: { type: ObjectId, required: true },
  status: { type: String, required: true },
  description: { type: String, default: '' },
  items: { type: [items], required: false }
})

saleSchema.methods.addItems = function(items) {
  this.items.push(items)
}

let Sale = module.exports = mongoose.model('Sale', saleSchema)