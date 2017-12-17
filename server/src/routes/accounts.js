import express from 'express'

import Account from '../models/account'

let router = express.Router()

let LocalStrategy = require('passport-local').Strategy

// Register Account
router.put('/register', function(req, res) {

  Account.update({subdomain: req.body.subdomain}, req.body)
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