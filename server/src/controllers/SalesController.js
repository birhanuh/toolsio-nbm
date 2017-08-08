import Sale from '../models/Sale'

export default {
  
  find: (callback) => {
     Sale.find().populate({ path: 'customer', select: 'name' }).exec(function(err, sales) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, sales)
    })
  },

  findById: (id, callback) => {
    Sale.findById(id).populate([{ path: 'customer', select: 'name'}, { path: 'tasks' }]).populate('items').exec(function(err, sale) {
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