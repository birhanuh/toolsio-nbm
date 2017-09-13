// Mongodb connecton
import db from '../../../server/src/db'

import axios from 'axios'

// Load factories 
import FactoryGirl from '../factories'

// Load factories 
import sales from '../fixtures/sales' 

// Schema
var Sale = require('../../../server/src/models/Sale')

/*// Factories 
import fixtures from 'pow-mongoose-fixtures'
//Files
fixtures.load(__dirname + '/../fixtures/sales.js')*/

let controllers = require('../../../server/src/controllers')
let salesController = controllers['sales']
let sale = FactoryGirl.create('sale')

describe("Sale", function() { 

  beforeAll(function() {
    db.connect('mongodb://localhost/toolsio_test')
  })

  afterAll(function() {
    db.drop('sales', 'mongodb://localhost/toolsio_test')
  })

  describe('validation', function() {
    test('should fail with validation errors for each required field', function() {
      var sale = new Sale()
      sale.save(function(err) {
        expect(err).not.toBeNull()
        expect(err.errors.customer.message).toContain('Customer is required.')
        expect(err.errors.name.message).toContain('Name is required.')
        expect(err.errors.deadline.message).toContain('Deadline is required.')
      })
    })
  })

  describe('CRUD', function() {
    test('creates sale', function() { 

      salesController.create(sale, function(error, result) {
        expect(result.length).not.toBe(0)
      })
      db.fixtures('mongodb://localhost/toolsio_test', Sale, sales)
    })

    test('finds sale', function() { 

      // salesController.create(sale, function(error, result) {
      //   expect(result.length).not.toBe(0)
      // })
    })

    test('updates sale', function() { 

      // salesController.put(sale, function(error, result) {
      //   expect(result.length).not.toBe(0)
      // })
      // db.fixtures('mongodb://localhost/toolsio_test', Sale, sales)
    })

    xtest('deletes sale', function() { 

      salesController.create(sale, function(error, result) {
        expect(result.length).not.toBe(0)
      })
      db.fixtures('mongodb://localhost/toolsio_test', Sale, sales)
    })

    /*
    test('it returns status code 200', function() {
      axios.post('/api/sales', sale).then(res => { 
        expect(response.statusCode).toBe(200)
      })
    })
    */
  })

})
