// Mongodb connection
import db from '../../db'

// Macros
import Macros from '../helpers/macros'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import Customer from '../../models/customer'

let customerCreated = {}

describe("Customer", () => { 

  beforeAll((done) => {
    db.connect(process.env.DB_HOST+process.env.TEST)
    done()
  })

  afterAll((done) => {
    Marcros.db('customers', process.env.DB_DEVELOPMENT)
    done()
  })


  it('should fail with validation errors for each required field', (done) => {
    Customer.create({}, (err, customer) => {

      expect(err).not.toBeNull()
      expect(err.errors.name.message).toContain('Name is required.')
      expect(err.errors.vatNumber.message).toContain('Vat number is required.')
      
      done()
    })
  })

  it('saves Customer', (done) => {
    
    FactoryGirl.create('customer').then(customer => {
      Customer.create(customer, (err, customer) => {
        
        // Assign created Customer
        customerCreated = customer
   
        expect(customer).not.toBeNull()
        expect(customer.name).toContain('Customer 1')
        expect(customer.contact.phoneNumber).toContain('12345678910')
        expect(customer.vatNumber).toContain('1234')

        done()
      })
    })  
  })

  it('finds Customer', (done) => { 

    Customer.findById(customerCreated._id, (error, customer) => {
      expect(customer).not.toBeNull()

      done()
    })
  })

  it('updates Customer', (done) => { 

    // Update name
    customerCreated.name = 'Customer 1 updated'
    
    Customer.findByIdAndUpdate(customerCreated._id, customerCreated, {new: true}, (error, customer) => {
      
      expect(customer.name).toContain('Customer 1 updated')

      done()
    })
  })

  it('deletes Customer', (done) => { 

    Customer.findByIdAndRemove(customerCreated._id, (error, customer) => {
      expect(customer).not.toBeNull()

      done()
    })
  })

})
