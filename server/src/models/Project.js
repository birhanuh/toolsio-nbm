import mongoose from 'mongoose' 

let projectSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required."] },
  deadline: { type: Date, required: [true, "Deadline is required."] },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: [true, "Customer is required."] },
  status: { type: String, required: [true, "Status is required."] },
  description: { type: String, default: '' },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],

  createdAt: Date,
  updatedAt: Date
})

projectSchema.pre('validate', function (next) {
  this.status = "new"
  next()
}) 

let Project = module.exports = mongoose.model('Project', projectSchema)
