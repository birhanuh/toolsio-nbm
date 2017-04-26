import Sale from '../models/sale'

export default {
  
  find: function(params, callback) {
    Sale.find(params, function(err, sales) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, sales)
    })
  },

  findById: function(id, callback) {
    Sale.findById(id, function(err, sale) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, sale)
    })
  },

  create: function(params, callback) {
    Sale.create(params, function(err, sale) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, sale)
    })
  },

  update: function(id, params, callback) {
    Sale.findByIdAndUpdate(id, params, {new:true}, function(err, sale) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, sale)
    })
  },

  delete: function(id, callback) {
    Sale.findByIdAndRemove(id, function(err, sale) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, null)
    })
  }
}