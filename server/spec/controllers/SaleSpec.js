// Mongodb credentials
import config from '../../src/config'

// Mongodb connecton
import db from '../../src/db'

import axios from 'axios'

var FactoryGirl = require('factory_girl') 

// Load factories 
//FactoryGirl.definitionFilePaths = [__dirname + '/factories']
//FactoryGirl.findDefinitions()

FactoryGirl.define('sale', function() {
  //this.id = Math.random()*101|0;
  this.name = 'Sale 1'
  this.date = new Date() 
  this.status = 'NEW'
  this.description = 'Description. ..'
})

describe("SalesController", function() { 

  let controllers = require('../../src/controllers')
  let salesController = controllers['sales']
  let sale = FactoryGirl.create('sale')

  beforeEach(function() {
    db.connect(config.mongoose_test)
  })

  afterEach(function() {
    db.drop('sales', config.mongoose_test)
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
