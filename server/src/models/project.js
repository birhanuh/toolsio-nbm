import mongoose from 'mongoose' 

let tasks = []

// User Schema 
let projectSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required."] },
  deadline: { type: Date, required: [true, "Deadline is required."] },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: [true, "Customer is required."] },
  status: { type: String, default: "NEW" },
  description: { type: String, default: '' },
  items: [tasks]
})

projectSchema.methods.addItems = function(items) {
  this.items.push(items)
}

let Project = module.exports = mongoose.model('Project', projectSchema);
