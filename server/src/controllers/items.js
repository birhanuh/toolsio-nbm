import Item from '../models/item'
import Sale from '../models/sale'

export default {
  
  find: (req, callback) => {
    
    Item.find(function(err, items) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, items)
    })
  },

  findById: (req, callback) => {

    let id = req.params.id

    Item.findById(id, (err, item) => {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, item)
    })
  },

  create: (req, callback) => {  

    let body = req.body

    Item.create(body, (err, item) => {
      if (err) {
        callback(err, null)
        return
      }
      
      callback(null, item)

    })
  },

  findByIdAndUpdate: (req, callback) => {

    let id = req.params.id
    let body = req.body

    Item.findByIdAndUpdate(id, body, {new: true}, (err, item) => {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, item)
    })
  },

  findByIdAndRemove: (req, callback) => {

    let id = req.params.id

    Item.findByIdAndRemove(id, (err, item) => {
      if (err) {
        callback(err, null)
        return
      }

      // Remove Item from this Sale
      Sale.findByIdAndUpdate(item._creator, { $pull: { items: id}, $inc: {total: -item.price} }, (err, Sale) => {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, null)
      })

      callback(null, null)
    })
  }
}
