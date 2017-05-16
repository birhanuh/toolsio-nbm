import Sale from '../models/sale'
import { Validation } from '../utils'

export default {
  
  find: (params, callback) => {
    Sale.find(params, function(err, sales) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, sales)
    })
  },

  findById: (id, callback) => {
    Sale.findById(id, function(err, sale) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, sale)
    })
  },

  create: (params, callback) => {
    const { errors, isValid } = Validation.validateSaleInput(params)

    if (isValid) {
      Sale.create(params, function(err, sale) {
        if (err) {
          callback(null, err, null)
          return
        }
        
        callback(null, null, sale)
      })
    } else {
      callback(errors, null, null)
    }
  },

  update: (id, params, callback) => {
    const { errors, isValid } = Validation.validateSaleInput(params)

    if (isValid) {
      Sale.findByIdAndUpdate(id, params, {new: true}, function(err, sale) {
        if (err) {
          callback(null, err, null)
          return
        }
        console.log('sale: ', sale)
        callback(null, null, sale)
      })
    } else {
      callback(errors, null, null)
    }

  },

  delete: (id, callback) => {
    Sale.findByIdAndRemove(id, function(err, sale) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, null)
    })
  }
}