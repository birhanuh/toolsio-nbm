import Sale from '../models/sale'
import Item from '../models/item'
import Invoice from '../models/invoice'

export default {
  
  find: (req, callback) => {
    
     Sale.find({}).select('-items').populate({ path: 'customer', select: 'name' }).exec((err, sales) => {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, sales)
    })
  },

  findById: (req, callback) => {

    let id = req.params.id

    Sale.findById(id).populate([{ path: 'customer', select: 'name'}, { path: 'items' }, { path: 'invoice', select: '_id' }]).exec((err, sale) => {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, sale)
    })
  },

  create: (req, callback) => {

    let body = req.body
    delete body['_id']

    Sale.create(body, (err, sale) => {
      if (err) {
        callback(err, null)
        return
      }
      
      callback(null, sale)
    })
  },

  findByIdAndUpdate: (req, callback) => {

    let id = req.params.id
    let body = req.body

    Sale.findByIdAndUpdate(id, body, {new: true}, (err, sale) => {
      if (err) {
        callback(err, null)
        return
      }
    
      callback(null, sale)
    })

  },

  findByIdAndRemove: (req, callback) => {

    let id = req.params.id

    Sale.findByIdAndRemove(id, (err, sale) => {
      if (err) {
        callback(err, {})
        return
      }

      // Remove associated Item
      Item.remove({ _creator: sale._id }, (err, item) => {
        if (err) {
          callback(err, null)
          return
        }
      })

      // Remove associated Invoice
      Invoice.remove({ sale: sale._id }, (err, invoice) => {
        if (err) {
          callback(err, null)
          return
        }
      })

      callback(null, null)
    })
  }
}