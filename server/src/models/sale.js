import mongoose from 'mongoose'

// User Schema 
let SaleSchema = new mongoose.Schema({
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

let Sale = module.exports = mongoose.model('Sale', SaleSchema);