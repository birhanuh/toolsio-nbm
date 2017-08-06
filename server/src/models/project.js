import mongoose from 'mongoose' 

// User Schema 
let projectSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required."] },
  deadline: { type: Date, required: [true, "Deadline is required."] },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: [true, "Customer is required."] },
  status: { type: String, default: "NEW" },
  description: { type: String, default: '' },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],

  created_at: Date,
  updated_at: Date
})

projectSchema.methods.addItems = function(items) {
  this.items.push(items)
}

let Project = module.exports = mongoose.model('Project', projectSchema);
