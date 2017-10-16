import Invoice from '../models/invoice'

export default {
  
  find: (callback) => {
    Invoice.find(function(err, invoices) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, invoices)
    })
  },

  findById: (id, callback) => {
    Invoice.findById(id, function(err, invoice) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, invoice)
    })
  },

  create: (params, callback) => {  
    Invoice.create(params, function(err, invoice) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, invoice)
    })
  },

  findByIdAndUpdate: (id, params, callback) => {
    Invoice.findByIdAndUpdate(id, params, {new: true}, function(err, invoice) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, invoice)
    })
  },

  findByIdAndRemove: (id, callback) => {
    Invoice.findByIdAndRemove(id, function(err, invoice) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, null)
    })
  }
}