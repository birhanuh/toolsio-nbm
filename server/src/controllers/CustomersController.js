import Customer from '../models/Customer'

export default {
  
  find: (params, callback) => {
    Customer.find(params, function(err, customers) {
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
    console.log('customers: ', params)
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