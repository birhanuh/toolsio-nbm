import express from 'express'

import Account from '../models/Account'

let router = express.Router()

let LocalStrategy = require('passport-local').Strategy

// Register Account
router.post('/register', function(req, res) {

  Account.create(req.body)
    .then(account => 
      res.json({ result: account.subdomain })
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
router.get('/:subdomain', (req, res) => {
  Account.find({ subdomain: req.params.subdomain }).then(account => {
    res.json( { account }) 
  })
})

module.exports = router