import Item from '../models/item'
import Sale from '../models/sale'

export default {
  
  find: (query, params, callback) => {
    Item.find(params, function(err, items) {
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

  create: (params, callback) => {  
    Item.create(params, function(err, item) {
      if (err) {
        callback(err, null)
        return
      }
      
      callback(null, item)

    })
  },

  findByIdAndUpdate: (id, params, callback) => {
    Item.findByIdAndUpdate(id, params, {new: true}, function(err, item) {
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
