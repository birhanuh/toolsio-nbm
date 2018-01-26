import Customer from '../../models/customer'

import Project from '../../models/project'
import Sale from '../../models/sale'
import Invoice from '../../models/invoice'

export default {
  
  find: (req, callback) => {
    Customer.find({}).select('name contact vatNumber').exec((err, customers) => {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, customers)
    })
  },

  findById: (req, callback) => {

    let id = req.params.id
    
    Customer.findById(id).populate([{ path: 'sales', select: 'name status deadline' }, { path: 'projects', select: 'name status deadline' }, { path: 'invoices', select: 'referenceNumber status deadline paymentTerm' }]).exec(function(err, customer) {
      if (err) {
        callback(err, null)
        return
      }
      
      callback(null, customer)
    })
  },

  create: (req, callback) => {  

    let body = req.body
    delete body['_id']
    
    Customer.create(body, (err, customer) => {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, customer)
    })
  },

  findByIdAndUpdate: (req, callback) => {

    let id = req.params.id
    let body = req.body

    Customer.findByIdAndUpdate(id, body, {new: true}, (err, customer) => {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, customer)
    })
  },

  findByIdAndRemove: (req, callback) => {

    let id = req.params.id

    Customer.findByIdAndRemove(id, (err, customer) => {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, null)
    })
  }
}