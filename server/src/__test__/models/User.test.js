// Mongodb connection
import db from '../../db'

// Macros
import Macros from '../helpers/Macros'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import User from '../../models/User'

let userCreated = {}

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
   
    FactoryGirl.build('user').then(user => {
      User.create(user, (err, user) => {
       // Assign created User
        userCreated = user

        expect(user).not.toBeNull()
        expect(user.firstName).toContain('User 1')
        expect(user.email).toContain('user1@ymail.com')

        done()
      })
    })
  })

  it('finds User', (done) => { 

    User.getUserByEmail(userCreated.email, (error, user) => {
      expect(user).not.toBeNull()

      done()
    })
  })

  it('updates User', (done) => { 

    // Update name
    userCreated.firstName = 'User 1 updated'
    
    User.findByIdAndUpdate(userCreated._id, userCreated, {new: true}, (error, user) => {
      expect(user.firstName).toContain('User 1 updated')

      done()
    })
  })

  it('deletes User', (done) => { 

    FactoryGirl.build('user').then(user => {
      User.findByIdAndRemove(userCreated._id, userCreated, (error, user) => {
        expect(user).not.toBeNull()

        done()
      })
    })  
  })

})
