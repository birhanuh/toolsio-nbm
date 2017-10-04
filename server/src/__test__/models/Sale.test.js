// Mongodb connection
import db from '../../db'

// Macros
import Macros from '../helpers/macros'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import Sale from '../../models/sale'

//Files
/*fixtures.load(__dirname + '/../fixtures/sales.js')*/

let saleCreated = {}

describe("Sale",  () => { 

  beforeAll( (done) => {
    db.connect(process.env.DB_HOST+process.env.TEST)
    done()
  })

  afterAll( (done) => {
    Marcros.db('sales', process.env.DB_DEVELOPMENT)
    done()
  })

  it('should fail with validation errors for each required field', (done) => {
    
    Sale.create({}, (err, sale) => {      
      expect(err).not.toBeNull()
      expect(err.errors.customer.message).toContain('Customer is required.')
      expect(err.errors.name.message).toContain('Name is required.')
      expect(err.errors.deadline.message).toContain('Deadline is required.')

      done()
    })
  })

  it('saves Sale', (done) => {

    FactoryGirl.create('sale').then(sale => {
      Sale.create(sale, (err, sale) => {      
        // Assign created Sale
        saleCreated = sale
       
        expect(sale).not.toBeNull()
        expect(sale.name).toContain('Sale 1')
        expect(sale.status).toContain('new')
        expect(sale.description).toContain('Description 1...')

        done()
      })
    })  
  })

  it('finds Sale', (done) => { 

    Sale.findById(saleCreated._id, (error, sale) => {
      expect(sale).not.toBeNull()

      done()
    })
  })

  it('updates Sale', (done) => { 

    // Update name
    saleCreated.name = 'Sale 1 updated'
    
    Sale.findByIdAndUpdate(saleCreated._id, saleCreated, {new: true}, (error, sale) => {
      expect(sale.name).toContain('Sale 1 updated')
      done()
    })
  })

  it('deletes Sale', (done) => { 

    Sale.findByIdAndRemove(saleCreated._id, (error, sale) => {
     expect(sale).not.toBeNull()
     
     done()
    })
    //db.fixtures('mongodb://localhost/toolsio_test', Sale, sales)
  })

})
