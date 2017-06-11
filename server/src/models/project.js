import mongoose from 'mongoose'

// User Schema 
let ProjectSchema = new mongoose.Schema({
  name: {
    type: String, 
    default:''
  }, 
  date: {
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String, 
    default: 'NEW'
  },
  description: {
    type: String, 
    default: ''
  }
})

let Project = module.exports = mongoose.model('Project', ProjectSchema);
