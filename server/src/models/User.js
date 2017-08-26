import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

let Schema = mongoose.Schema
const SALT_WORK_FACTOR = 10

// User Schema 
const UserSchema = new Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  firstName: { type: String /**, index: true**/ }, 
  lastName: { type: String },
  email: { type: String, required: [true, "Email is required."], index: { unique: true } },
  password: { type: String, required: [true, "Password is required."] },
  admin: Boolean,
  meta: {
    age: Number,
    gender: String
  },
  avatar: { data: Buffer, contentType: String },

  createdAt: Date,
  updatedAt: Date
})

UserSchema.pre('save', function(next) {
  var user = this

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err)

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err)

      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByEmail = function(email, callback) {
  var query = {email: email}
  User.findOne(query, callback)
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err)throw err
    callback(null, isMatch)
  })
}

// module.exports.createUser = function(newUser, callback) {
//   bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash(newUser.password, salt, function(err, hash) {
//       newUser.password = hash;
//       newUser.save(callback);
//     })
//   })
// }