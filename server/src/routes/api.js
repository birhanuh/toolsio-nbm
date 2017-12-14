import express from 'express'
let router = express.Router()
import controllers from '../controllers'
import { authenticate, ensureAuthenticated } from '../middlewares/authenticate'

// POST recources (authenticate middleware function called when request comes and it checks for toke validation,
// if every thing is ok, it procced to the route code but, if there no-toket or token-is-invalid then middlewaer 
// response with error and halt operatoin so, route code never excutes)
router.get('/:resource', ensureAuthenticated, function(req, res) {
  
  let resource = req.params.resource 

  let controller = controllers[resource]
  if (controller == null) {
    res.status(500).json({
      errors: {
        confirmation: 'fail',
        message: 'Invalid Resource Request: '+resource
      }
    })
    return
  }

  controller.find(req.query, function(err, results) {
    if (err) {
      res.status(500).json({ 
        errors: {
          confirmation: 'fail',
          message: err
        }
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
router.get('/:resource/:id', ensureAuthenticated, function(req, res) {
  
  let resource = req.params.resource
  let id = req.params.id

  let controller = controllers[resource]
  if (controller == null) {
    res.status(500).json({
      errors: {
        confirmation: 'fail',
        message: 'Invalid Resource Request: '+resource
      }
    })
    return
  }

  controller.findById(id, function(err, result) {
    if (err) {
      res.status(500).json({ 
        errors: {
          confirmation: 'fail',
          message: err
        }
      })
      return
    }
  
    res.json({
      confirmation: 'success',
      result: result
    })
  })

})

// POST resource 
router.post('/:resource', ensureAuthenticated, function(req, res) {
  
  let resource = req.params.resource

  let controller = controllers[resource]
  if (controller == null) {
    res.status(500).json({
      errors: {
        confirmation: 'fail',
        message: 'Invalid Resource Request: '+resource
      }
    })
    return
  }

  // Remove the null _id value that comes from client side for making the _id availabe inside save middlewares 
  let requestBody = req.body
  delete requestBody['_id']
    
  controller.create(requestBody, function(err, result) {
    if (err) {
      res.status(500).json({ 
        errors: {
          confirmation: 'fail',
          message: err
        }
      })
      return
    }
    res.json({
      confirmation: 'success',
      result: result
    })
  })

})

// UPDATE resource with id
router.put('/:resource/:id', ensureAuthenticated, function(req, res) {

  let resource = req.params.resource

  let controller = controllers[resource]
  if (controller == null) {
    res.status(500).json({
      errors: {
        confirmation: 'fail',
        message: 'Invalid Resource Request: '+resource
      }  
    })
  } 

  controller.findByIdAndUpdate(req.params.id, req.body, function(err, result) {
    if (err) {
      res.status(500).json({ 
        errors: {
          confirmation: 'fail',
          message: err
        }
      })
      return
    }
    res.json({
      confirmation: 'success',
      result: result
    })
  })
})

// DELETE resource with id
router.delete('/:resource/:id', ensureAuthenticated, function(req, res) {
  
  let resource = req.params.resource
  let id = req.params.id

  let controller = controllers[resource]
  if (controller == null) {
    res.status(500).json({
      errors: {
        confirmation: 'fail',
        message: 'Invalid Resource Request: '+resource
      }
    })
    return
  }

  controller.findByIdAndRemove(id, function(err, result) {
    if (err) {
      res.status(500).json({ 
        errors: {
          confirmation: 'fail',
          message: err
        }
      })
      return
    }
  
    res.json({
      confirmation: 'success',
      result: result
    })
  })

})

export default router
