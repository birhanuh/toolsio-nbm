import mongoose from 'mongoose' 
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema
const SALT_WORK_FACTOR = 10

// User Schema 
const UserSchema = new Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: "account" },
  firstName: { type: String /**, index: true**/ }, 
  lastName: { type: String },
  email: { type: String, required: [true, "Email is required."], index: {unique: true, dropDups: true} },
  password: { type: String, required: [true, "Password is required."] },
  admin: {type: Boolean, default: false},
  avatar: { data: Buffer, contentType: String },
  meta: {
    age: Number,
    gender: String
  }
},{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp. 
})

UserSchema.pre('save', function(next) {
  let user = this

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)

      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})

UserSchema.post('save', (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    let message = {
      errors: {
        email: {
          message: 'There is user with such email.'
        } 
      }
    }
    next(message)
  } else {
    next(error)
  }
})

let User = module.exports = mongoose.model('user', UserSchema)

module.exports.getUserByEmail = (email, callback) => {
  let query = {email: email}
  User.findOne(query, callback)
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
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