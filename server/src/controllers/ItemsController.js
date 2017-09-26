import Item from '../models/Item'
import Sale from '../models/Sale'

export default {

  create: (params, callback) => {  
    Item.create(params, function(err, item) {
      if (err) {
        callback(err, null)
        return
      }
      
      // Get Sale of item owner 
      Sale.findByIdAndUpdate(item._creator).populate([{ path: 'customer', select: 'name'}, { path: 'items' }]).exec(function(err, sale) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, sale)
      })

    })
  },

  findByIdAndUpdate: (id, params, callback) => {
    Item.findByIdAndUpdate(id, params, {new: true}, function(err, item) {
      if (err) {
        callback(err, null)
        return
      }

      // Get Sale of item owner 
      Sale.findByIdAndUpdate(item._creator).populate([{ path: 'customer', select: 'name'}, { path: 'items' }]).exec(function(err, sale) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, sale)
      })
    })
  },

  findByIdAndRemove: (id, callback) => {
    Item.findByIdAndRemove(id, function(err, item) {
      if (err) {
        callback(err, null)
        return
      }

      // Remove item from Sale
      Sale.findByIdAndUpdate(item._creator).populate([{ path: 'customer', select: 'name'}, { path: 'items' }]).exec(function(err, sale) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, sale)
      })
    })
  }
}