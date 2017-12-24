import Invoice from '../models/invoice'

export default {
  
  find: (req, callback) => {
    Invoice.find({}).select('deadline status customer sale project').populate([{path: 'sale', select: 'name total'}, {path: 'project', select: 'name total' }, {path: 'customer', select: 'name'}]).exec(function(err, invoices) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, invoices)
    })
  },

  findById: (id, callback) => {
    Invoice.findById(id).populate([{path: 'sale', populate: { path: 'items' }}, {path: 'project', populate: { path: 'tasks' }}, {path: 'customer'}]).exec(function(err, invoice) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, invoice)
    })
  },

  create: (reqBody, callback) => {  
    Invoice.create(reqBody, function(err, invoice) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, invoice)
    })
  },

  findByIdAndUpdate: (id, reqBody, callback) => {
    Invoice.findByIdAndUpdate(id, reqBody, {new: true}, function(err, invoice) {
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