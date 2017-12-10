// Evironment config
require('dotenv').config()

// Mongodb connection
import db from '../../db'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import Item from '../../models/item'

let itemCreated = {}

describe("Item", () => { 

  beforeAll((done) => {
    db.connect(process.env.DB_HOST+process.env.DB_TEST)
    db.dropCollection('items')
    done()
  })

  afterAll((done) => {
    db.close()
    done()
  })


  it('should fail with validation errors for each required field', (done) => {

    Item.create({}, (err, item) => {
      expect(err).not.toBeNull()
      expect(err.errors.name.message).toContain('Name is required.')
      expect(err.errors.unit.message).toContain('Unit is required.')
      
      done()
    })
  })

  it('saves Item', (done) => {
    
    FactoryGirl.create('item').then(item => {    
      Item.create(item, (err, item) => {      
        // Assign created Item
        itemCreated = item
   
        expect(item).not.toBeNull()
        expect(item.name).toContain('Item 1')
        expect(item.unit).toContain('meter')
        expect(item.price).toBe(20)

        done()
      })
    })  
  })

  it('finds Item', (done) => { 

    Item.findById(itemCreated._id, (error, item) => {
      expect(item).not.toBeNull()

      done()
    })
  })

  it('updates Item', (done) => { 

    // Update name
    itemCreated.name = 'Item 1 updated'
    
    Item.findByIdAndUpdate(itemCreated._id, itemCreated, {new: true}, (error, item) => {      
      expect(item.name).toContain('Item 1 updated')

      done()
    })
  })

  it('deletes Item', (done) => { 

    Item.findByIdAndRemove(itemCreated._id, (error, item) => {
      expect(item).not.toBeNull()
      
      done()
    })
  })

})
