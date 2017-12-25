import Item from '../models/item'
import Sale from '../models/sale'

export default {
  
  find: (req, type, callback) => {
    Item.find(function(err, items) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, items)
    })
  },

  findById: (id, callback) => {
    Item.findById(id, function(err, item) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, item)
    })
  },

  create: (req, callback) => {  
    Item.create(req.body, function(err, item) {
      if (err) {
        callback(err, null)
        return
      }
      
      callback(null, item)

    })
  },

  findByIdAndUpdate: (id, reqBody, callback) => {
    Item.findByIdAndUpdate(id, reqBody, {new: true}, function(err, item) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, item)
    })
  },

  findByIdAndRemove: (id, callback) => {
    Item.findByIdAndRemove(id, function(err, item) {
      if (err) {
        callback(err, null)
        return
      }

      // Remove Item from this Sale
      Sale.findByIdAndUpdate(item._creator, { $pull: { items: id}, $inc: {total: -item.price} }, function(err, Sale) {
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
