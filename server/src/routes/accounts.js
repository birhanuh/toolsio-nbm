import express from 'express'

import Account from '../models/Account'

let router = express.Router()

let LocalStrategy = require('passport-local').Strategy

// Register Account
router.put('/register', function(req, res) {

  Account.update({companyName: req.body.companyName}, req.body)
    .then(account => 
      res.json({ result: account.companyName })
    ).catch(err => 
      res.status(500).json({ 
        errors: {
          confirmation: 'fail',
          message: err
        }
      })
    )
})

// Get regisetred user
router.get('/:companyName', (req, res) => {
  Account.find({ companyName: req.params.companyName }).then(account => {
    res.json( { account }) 
  })
})

module.exports = router