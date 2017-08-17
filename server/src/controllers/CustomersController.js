import Customer from '../models/Customer'

export default {
  
  find: (callback) => {
    Customer.find(function(err, customers) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, customers)
    })
  },

  findById: (id, callback) => {
    Customer.findById(id, function(err, customer) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, customer)
    })
  },

  create: (params, callback) => {  
    Customer.create(params, function(err, customer) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, customer)
    })
  },

  findByIdAndUpdate: (id, params, callback) => {
    Customer.findByIdAndUpdate(id, params, {new: true}, function(err, customer) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, customer)
    })
  },

  findByIdAndRemove: (id, callback) => {
    Customer.findByIdAndRemove(id, function(err, customer) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, null)
    })
  }
}