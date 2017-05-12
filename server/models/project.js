var mongoose = require('mongoose');

// User Schema 
var ProjectSchema = new mongoose.Schema({
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
});

var Project = module.exports = mongoose.model('Project', ProjectSchema);