import mongoose from 'mongoose' 

// User Schema 
let projectSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required."] },
  deadline: { type: Date, required: [true, "Deadline is required."] },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: [true, "Customer is required."] },
  status: { type: String, required: [true, "Status is required."] },
  description: { type: String, default: '' },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],

  created_at: Date,
  updated_at: Date
})

projectSchema.pre('validate', function (next) {
  this.status = "new"
  next()
}) 

projectSchema.methods.addItems = function(task) {
  this.tasks.push(task)
}

let Project = module.exports = mongoose.model('Project', projectSchema);
