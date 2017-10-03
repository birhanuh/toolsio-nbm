// Mongodb connection
import db from '../../db'

// Macros
import Macros from '../helpers/Macros'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import Account from '../../models/account'

let accountCreated = {}

describe("Account", () => { 

  beforeAll((done) => {
    db.connect('mongodb://localhost/toolsio_test')
    done()
  })

  afterAll((done) => {
    Marcros.db('accounts', process.env.DB_DEVELOPMENT)
    done()
  })


  it('should fail with validation errors for each required field', (done) => {

    Account.create({}, (err, account) => {
      expect(err).not.toBeNull()
      expect(err.errors.subdomain.message).toContain('Subdomain is required.')
      expect(err.errors.industry.message).toContain('Industry is required.')

      done()
    })
  })

  it('saves Account', (done) => {
   
    FactoryGirl.build('account').then(account => {
      Account.create(account, (err, account) => {
       // Assign created Account
        accountCreated = account

        expect(account).not.toBeNull()
        expect(account.subdomain).toContain('company1')
        expect(account.industry).toContain('IT')

        done()
      })
    })
  })

  it('finds Account', (done) => { 

    Account.findById(accountCreated._id, (error, account) => {
      expect(account).not.toBeNull()

      done()
    })
  })

  it('updates Account', (done) => { 

    // Update name
    accountCreated.subdomain = 'company updated'
    
    Account.findByIdAndUpdate(accountCreated._id, accountCreated, {new: true}, (error, account) => {
      expect(account.subdomain).toContain('company updated')

      done()
    })
  })

  it('deletes Account', (done) => { 

    FactoryGirl.build('account').then(account => {
      Account.findByIdAndRemove(accountCreated._id, accountCreated, (error, account) => {
        expect(account).not.toBeNull()

        done()
      })
    })  
  })

})
