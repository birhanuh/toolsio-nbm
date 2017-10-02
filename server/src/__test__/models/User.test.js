// Mongodb connection
import db from '../../db'

// Macros
import Macros from '../helpers/Macros'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import User from '../../models/User'

// Factored User
let user = FactoryGirl.create('user')

let userId = null

describe("User", () => { 

  beforeAll((done) => {
    db.connect('mongodb://localhost/toolsio_test')
    done()
  })

  afterAll((done) => {
    Marcros.dropDatabase()
    done()
  })


  it('should fail with validation errors for each required field', (done) => {

    User.create({}, (err, user) => {
      expect(err).not.toBeNull()
      expect(err.errors.email.message).toContain('Email is required.')
      expect(err.errors.password.message).toContain('Password is required.')

      done()
    })
  })

  it('saves User', (done) => {
   
    User.create(user, (err, user) => {
     // Assign id
      userId = user._id

      expect(user).not.toBeNull()
      expect(user.firstName).toContain('User 1')
      expect(user.email).toContain('user@email.com')

      done()
    })
  })

  it('finds User', (done) => { 

    User.getUserByEmail(user.email, (error, user) => {
      expect(user).not.toBeNull()

      done()
    })
  })

  it('updates User', (done) => { 

    // Update name
    user.firstName = 'User 1 updated'
    
    User.findByIdAndUpdate(userId, user, {new: true}, (error, user) => {
      expect(user.firstName).toContain('User 1 updated')

      done()
    })
  })

  it('deletes User', (done) => { 

    User.findByIdAndRemove(userId, user, (error, user) => {
      expect(user).not.toBeNull()

      done()
    })
  })

})
