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

describe("Sale controller", function() { 

  let controllers = require('../../src/controllers')
  let salesController = controllers['sales']
  let sale = FactoryGirl.create('sale')

  beforeEach(function() {
    db.connect(config.moongose_test)
  })

  afterEach(function() {
    db.drop(config.moongose_test, 'sales')
  })

  it("create", function() {
    /*axios.post('/api/sales', sale).then(res => { 
      expect(response.statusCode).toBe(200)
    })*/
    salesController.create(sale, function(valdiationErr, dbError, result) {
      console.log('sale: ', sale)
      expect(result.length).not.toBe(0)
      //done()
    })

  })

})
