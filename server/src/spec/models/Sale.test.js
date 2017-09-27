// Mongodb connection
import db from '../../db'

// Macros
import Macros from '../helpers/Macros'

// Load factories 
import FactoryGirl from '../factories'

// Load factories 
import sales from '../fixtures/sales' 

// Schema
import Sale from '../../models/Sale'

/*// Factories 
import fixtures from 'pow-mongoose-fixtures'
//Files
fixtures.load(__dirname + '/../fixtures/sales.js')*/

// Factored Sale
let sale = FactoryGirl.create('sale')

let saleId = null

describe("Sale", function() { 

  beforeAll(function() {
    db.connect('mongodb://localhost/toolsio_test')
  })

  afterAll(function() {
    Macros.dropDatabase()
  })

  it('should fail with validation errors for each required field', function(done) {
    
    Sale.create({}, function(err, sale) {      
      expect(err).not.toBeNull()
      expect(err.errors.customer.message).toContain('Customer is required.')
      expect(err.errors.name.message).toContain('Name is required.')
      expect(err.errors.deadline.message).toContain('Deadline is required.')

      done()
    })
  })

  it('saves Sale', function(done) {

    Sale.create(sale, function(err, sale) {      
      // Assign id
      saleId = sale._id
     
      expect(sale).not.toBeNull()
      expect(sale.name).toContain('Sale 1')
      expect(sale.status).toContain('new')
      expect(sale.description).toContain('Description 1...')

      done()
    })
  })

  it('finds Sale', function(done) { 

    Sale.findById(saleId, sale, function(error, sale) {
      expect(sale).not.toBeNull()

      done()
    })
  })

  it('updates Sale', function(done) { 

    // Update name
    sale.name = 'Sale 1 updated'
    
    Sale.findByIdAndUpdate(saleId, sale, {new: true}, function(error, sale) {
      expect(sale.name).toContain('Sale 1 updated')
      done()
    })
  })

  it('deletes Sale', function(done) { 

    Sale.findByIdAndRemove(saleId, sale, function(error, sale) {
     expect(sale).not.toBeNull()
     
     done()
    })
    //db.fixtures('mongodb://localhost/toolsio_test', Sale, sales)
  })

})
