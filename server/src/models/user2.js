// import bookshelf from '../../db/bookshelf'
// import bcrypt from 'bcrypt'
// import Promise from 'bluebird'

// const SALT_WORK_FACTOR = 10

// export default bookshelf.Model.extend({
  
//   tableName: 'users',
  
//   initialize: function() {
//     this.on('saving', this.hashPassword);
//   },

//   hashPassword: function(model, attrs, options) {
//     return new Promise(function(resolve, reject) {
//       // only hash the password if it has been modified (or is new)
//       //if (!model.changed('password')) return

//       // generate a salt
//       bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
//         if (err) return reject(err)

//         // hash the password using our new salt
//         bcrypt.hash(model.attributes.password, salt, (err, hash) => {
//           if (err) return reject(err)

//           // override the cleartext password with the hashed one
//           model.set('password', hash)
//           resolve(hash)
//         })
//       })
//     })
//   }
// }, {

//   comparePassword: (candidatePassword, hash, callback) => {
//     bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
//       if (err) throw err
//       callback(null, isMatch)
//     })
//   },

//   byEmail: (email) => {
//     return this.forge().query({where:{ email: email }}).fetch();
//   }
// });




