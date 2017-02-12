var mongoose = require('mongoose');

var Schema = mongoose.Schema

// User Schema 
var ProjectSchema = new Schema({
  name: {
    type: String
  }, 
  date: {
    type: Date, 
  },
  status: {
    type: String
  },
  description: {
    type: String
  }
});

var Project = module.exports = mongoose.model('Project', ProjectSchema);