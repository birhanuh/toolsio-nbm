// Mongodb credentials
import config from '../../src/config'

// Mongodb connecton
import db from '../../src/db'

import axios from 'axios'

// Load factories 
import FactoryGirl from '../factories' 

describe("SalesController", function() { 

  let controllers = require('../../src/controllers')
  let salesController = controllers['sales']
  let sale = FactoryGirl.create('sale')

  beforeAll(function() {
    db.connect(config.mongoose_test)
  })

  afterAll(function() {
    db.drop('sales', config.mongoose_test)
  })

  it("creates sale", function() { 

    salesController.create(sale, function(valdiationErr, dbError, result) {
      expect(result.length).not.toBe(0)
    })
  })

  it("creates sale", function() { 

    salesController.create(sale, function(valdiationErr, dbError, result) {
      expect(result.length).not.toBe(0)
    })
  })

  /*
  it("it returns status code 200", function() {
    axios.post('/api/sales', sale).then(res => { 
      expect(response.statusCode).toBe(200)
    })
  })
  */

})
