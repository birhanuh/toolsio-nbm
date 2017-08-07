import Sale from '../models/Sale'

export default {
  
  find: (params, callback) => {
     Sale.find(params).populate('customer').populate('items').exec(function(err, sales) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, sales)
    })
  },

  findById: (id, callback) => {
    Sale.findById(id).populate('customer').populate('items').exec(function(err, sale) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, sale)
    })
  },

  create: (params, callback) => {
    Sale.create(params, function(err, sale) {
      if (err) {
        callback(err, null)
        return
      }
      
      callback(null, sale)
    })
  },

  findByIdAndUpdate: (id, params, callback) => {
    Sale.findByIdAndUpdate(id, params, {new: true}, function(err, sale) {
      if (err) {
        callback(err, null)
        return
      }
    
      callback(null, sale)
    })

  },

  findByIdAndRemove: (id, callback) => {
    Sale.findByIdAndRemove(id, function(err, r) {
      if (err) {
        callback(err, {})
        return
      }

      callback(null, {})
    })
  }
}