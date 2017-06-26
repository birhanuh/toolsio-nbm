let Sale = require('../../src/models/Sale')

describe("Sale", function() { 

  let sale = new Sale()

  it("should be invalid if name is empty", function() { 

      sale.validate(function(err) {
        expect(err.errors.name).to.exist
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