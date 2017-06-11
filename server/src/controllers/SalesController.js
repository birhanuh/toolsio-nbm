import Sale from '../models/sale'
import { Validation } from '../utils'

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

  update: function(id, params, callback) {
    const { errors, isValid } = Validation.validateSaleInput(params)

    if (isValid) {
      Sale.findByIdAndUpdate(id, params, {new: true}, function(err, sale) {
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