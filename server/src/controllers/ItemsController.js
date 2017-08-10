import Item from '../models/Item'
import Sale from '../models/Sale'

export default {
  
  find: (params, callback) => {
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
    Item.create(params.item, function(err, item) {
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

      callback(null, null)
    })
  }
}