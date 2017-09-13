// Mongodb connecton
import db from '../../../server/src/db'

import axios from 'axios'

// Load factories 
import FactoryGirl from '../factories'

// Load factories 
import sales from '../fixtures/sales' 

// Schema
import Sale from '../../../server/src/models/Sale'

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
    db.drop('sales', 'mongodb://localhost/toolsio_test')
  })

  describe('validation', function() {
    test('should fail with validation errors for each required field', function(done) {
      Sale.create({}, function(err, sale) {
        expect(err).not.toBeNull()
        expect(err.errors.customer.message).toContain('Customer is required.')
        expect(err.errors.name.message).toContain('Name is required.')
        expect(err.errors.deadline.message).toContain('Deadline is required.')
        done()
      })
    })

    test('saves Sale', function(done) {
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

    test('finds Sale', function(done) { 

      Sale.findById(saleId, sale, function(error, result) {
        expect(result.length).not.toBe(0)
      })
      done()
    })

    test('updates Sale', function(done) { 

      // Update name
      sale.name = 'Sale 1 updated'
      
      Sale.findByIdAndUpdate(saleId, sale, function(error, result) {
        expect(result[0].name).toContain('Sale 1 updated')
      })
      done()
    })

    test('deletes Sale', function(done) { 

      Sale.findByIdAndRemove(saleId, sale, function(error, result) {
        expect(result.length).toBe(0)
      })
      done()
      //db.fixtures('mongodb://localhost/toolsio_test', Sale, sales)
    })
  })

})
