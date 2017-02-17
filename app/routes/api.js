var express = require('express')
var router = express.Router()
var ProjectsController = require('../controllers/ProjectsController')
var controllers = require('../controllers')

// POST recources
router.get('/:resource', function(req, res, next) {
  
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
router.get('/:resource/:id', function(req, res) {
  
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
router.post('/:resource', function(req, res) {
  
  var resource = req.params.resource
  
  console.log('req: '+req.params)
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