// Mongodb credentials
import config from '../../../server/src/config'

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

describe("Sale", function() { 

  let controllers = require('../../../server/src/controllers')
  let salesController = controllers['sales']
  let sale = FactoryGirl.create('sale')

  beforeAll(function() {
    db.connect(config.mongoose_test)
  })

  afterAll(function() {
    db.drop('sales', config.mongoose_test)
  })

  describe('validation', function() {
    it('should fail with validation errors for each required field', function() {
      var sale = new Sale()
      sale.save(function(err) {
        console.log('err: ', err.errors.name.message)
        expect(err).not.toBeNull()
        expect(err.errors.customer.message).toContain('customer')
        expect(err.errors.name.message).toContain('name')
        expect(err.errors.date.message).toContain('date')
        expect(err.errors.status.message).toContain('status')
        //asyncSpecDone()
      })
      //jasmine.asyncSpecWait()
    })
  })

  describe('CRUD', function() {
    it("creates sale", function() { 

      salesController.create(sale, function(valdiationErr, dbError, result) {
        expect(result.length).not.toBe(0)
      })
      db.fixtures(config.mongoose_test, Sale, sales)
    })

    it("finds sale", function() { 

      salesController.create(sale, function(valdiationErr, dbError, result) {
        expect(result.length).not.toBe(0)
      })
    })

    it("updates sale", function() { 

      salesController.create(sale, function(valdiationErr, dbError, result) {
        expect(result.length).not.toBe(0)
      })
      db.fixtures(config.mongoose_test, Sale, sales)
    })

    xit("deletes sale", function() { 

      salesController.create(sale, function(valdiationErr, dbError, result) {
        expect(result.length).not.toBe(0)
      })
      db.fixtures(config.mongoose_test, Sale, sales)
    })

    /*
    it("it returns status code 200", function() {
      axios.post('/api/sales', sale).then(res => { 
        expect(response.statusCode).toBe(200)
      })
    })
    */
  })

})
