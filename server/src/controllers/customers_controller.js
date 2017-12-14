import Customer from '../models/customer'

import Project from '../models/project'
import Sale from '../models/sale'
import Invoice from '../models/invoice'

export default {
  
  find: (query, callback) => {
    Customer.find({}).select('name contact vatNumber').exec(function(err, customers) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, customers)
    })
  },

  findById: (id, callback) => {
    Customer.findById(id).populate([{ path: 'sales', select: 'name status deadline' }, { path: 'projects', select: 'name status deadline' }, { path: 'invoices', select: 'referenceNumber status deadline' }]).exec(function(err, customer) {
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

      // Remove Project from this Customer
      Project.findByIdAndUpdate(customer._id, { $pull: { projects: id} }, function(err, project) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, null)
      })

      // Remove Sale from this Customer
      Sale.findByIdAndUpdate(customer._id, { $pull: { sales: id} }, function(err, sale) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, null)
      })

       // Remove Invoice from this Customer
      Invoice.findByIdAndUpdate(customer._id, { $pull: { invoices: id} }, function(err, invoice) {
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