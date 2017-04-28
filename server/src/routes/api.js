var express = require('express')
var router = express.Router()
var controllers = require('../controllers')
import authenticate from '../middlewares/authenticate'

// POST recources (authenticate middleware function called when request comes and it checks for toke validation,
// if every thing is ok, it procced to the route code but, if there no-toket or token-is-invalid then middlewaer 
// response with error and halt operatoin so, route code never excutes)
router.get('/:resource', authenticate, function(req, res) {
  
  var resource = req.params.resource
  
  var controller = controllers[resource]
  if (controller == null) {
    res.json({
      confirmation: 'fail',
      message: 'Invalid Resource Request: '+resource
    })
    return
  }

  controller.find(req.query, function(err, results) {
    if (err) {
      res.json({
        confirmation: 'fail',
        message: err
      })
      return
    }
    res.json({
      confirmation: 'success',
      results: results
    })
  })

})

// GET resource with id
router.get('/:resource/:id', authenticate, function(req, res) {
  
  var resource = req.params.resource
  var id = req.params.id

  var controller = controllers[resource]
  if (controller == null) {
    res.json({
      confirmation: 'fail',
      message: 'Invalid Resource Request: '+resource
    })
    return
  }

  controller.findById(id, function(err, result) {
    if (err) {
      res.json({
        confirmation: 'fail',
        message: 'Not Found'
      })
      return
    }
    res.json({
      confirmation: 'success',
      result: result
    })
  })

})

// POST
router.post('/:resource', authenticate, function(req, res) {
  
  var resource = req.params.resource
  
  var controller = controllers[resource]
  if (controller == null) {
    res.json({
      confirmation: 'fail',
      message: 'Invalid Resource Request: '+resource
    })
    return
  }

  controller.create(req.body, function(err, result) {
    if (err) {
      res.json({
        confirmation: 'fail',
        message: err
      })
      return
    }
    res.json({
      confirmation: 'success',
      result: result
    })
  })

})

module.exports = router;