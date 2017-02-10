var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var db = mongoose.connection;
var Schema = mongoose.Schema

// User Schema 
var UserSchema = new Schema({
  firstName: {
    type: String
  }, 
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}