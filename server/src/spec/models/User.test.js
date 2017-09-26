// Mongodb connecton
import db from '../../db'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import User from '../../models/User'

// Factored User
let user = FactoryGirl.create('user')

let userId = null

describe("User", function() { 

  beforeAll(function() {
    db.connect('mongodb://localhost/toolsio_test')
  })

  afterAll(function() {
    db.drop()
  })


  it('should fail with validation errors for each required field', function(done) {

    User.create({}, function(err, user) {
      expect(err).not.toBeNull()
      expect(err.errors.email.message).toContain('Email is required.')
      expect(err.errors.password.message).toContain('Password is required.')

      done()
    })
  })

  it('saves User', function(done) {
   
    User.create(user, function(err, user) {
     // Assign id
      userId = user._id

      expect(user).not.toBeNull()
      expect(user.firstName).toContain('User 1')
      expect(user.email).toContain('user@email.com')

      done()
    })
  })

  it('finds User', function(done) { 

    User.getUserByEmail(user.email, function(error, user) {
      expect(user).not.toBeNull()

      done()
    })
  })

  it('updates User', function(done) { 

    // Update name
    user.firstName = 'User 1 updated'
    
    User.findByIdAndUpdate(userId, user, {new: true}, function(error, user) {
      expect(user.firstName).toContain('User 1 updated')

      done()
    })
  })

  it('deletes User', function(done) { 

    User.findByIdAndRemove(userId, user, function(error, user) {
      expect(user).not.toBeNull()

      done()
    })
  })

})
