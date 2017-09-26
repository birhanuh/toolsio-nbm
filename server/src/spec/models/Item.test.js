// Mongodb connecton
import db from '../../db'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import Item from '../../models/Item'

// Factored Item
let item = FactoryGirl.create('item')

let itemId = null

describe("Item", function() { 

  beforeAll(() => {
    db.connect('mongodb://localhost/toolsio_test')
  })

  afterAll(() => {
    db.drop()
  })


  it('should fail with validation errors for each required field', (done) => {

    Item.create({}, function(err, item) {
      expect(err).not.toBeNull()
      expect(err.errors.name.message).toContain('Name is required.')
      expect(err.errors.unit.message).toContain('Unit is required.')
      
      done()
    })
  })

  it('saves Item', (done) => {
    
    Item.create(item, (err, item) => {      
      // Assign id
      itemId = item._id
 
      expect(item).not.toBeNull()
      expect(item.name).toContain('Item 1')
      expect(item.unit).toContain('meter')
      expect(item.price).toBe(20)

      done()
    })
  })

  it('finds Item', (done) => { 

    Item.findById(itemId, item, (error, item) => {
      expect(item).not.toBeNull()

      done()
    })
  })

  it('updates Item', (done) => { 

    // Update name
    item.name = 'Item 1 updated'
    
    Item.findByIdAndUpdate(itemId, item, {new: true}, (error, item) => {      
      expect(item.name).toContain('Item 1 updated')

      done()
    })
  })

  it('deletes Item', (done) => { 

    Item.findByIdAndRemove(itemId, item, (error, item) => {
      expect(item).not.toBeNull()
      
      done()
    })
  })

})
