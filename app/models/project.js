var mongoose = require('mongoose');

// User Schema 
var ProjectSchema = new mongoose.Schema({
  name: {
    type: {type:String, default:''}
  }, 
  date: {
    type: {type:Date, default:Date.now} 
  },
  status: {
    type: {type:String, default:'NEW'}
  },
  description: {
    type: {type:String, default:''}
  }
});

var Project = module.exports = mongoose.model('Project', ProjectSchema);