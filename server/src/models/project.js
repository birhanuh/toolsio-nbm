var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

let tasks = []

// User Schema 
let projectSchema = new mongoose.Schema({
  customer: { type: ObjectId, required: true },
  name: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  status: { type: String, default: 'NEW', required: true },
  description: { type: String, default: '' },
  items: [tasks]
})

projectSchema.methods.addItems = function(items) {
  this.items.push(items)
}

let Project = module.exports = mongoose.model('Project', projectSchema);
