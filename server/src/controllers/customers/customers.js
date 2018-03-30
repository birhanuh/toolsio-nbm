import Customer from '../../models/customer'

import Project from '../../models/project'
import Sale from '../../models/sale'
import Invoice from '../../models/invoice'

export default {
  
  find: (req, callback) => {
   
    Customer.query({ select: ['name', 'phone_number', 'email', 'vat_number'] }).fetch()
      .then(customers => {

        callback(null, customers)
      })
      .catch(err => { 
        callback(err, null)
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

    let { name, vat_number, is_contact_included_in_invoice } = req.body
    let { email, phone_number } = req.body.contact
    let { street, postal_code, region, country } = req.body.address

    Customer.forge({name, vat_number, is_contact_included_in_invoice, email, phone_number,
      street, postal_code, region, country}, { hasTimestamps: true }).save()
        .then(customer => {
          callback(null, customer)
        })
        .catch(err => { 
           console.log('test ', err)
          callback(err, null)
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