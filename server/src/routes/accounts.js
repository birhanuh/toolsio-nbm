import express from 'express'

import Account from '../models/Account'

let router = express.Router()

let LocalStrategy = require('passport-local').Strategy

// Get regisetred user
router.get('/:subdomain', (req, res) => {
  Account.find({ subdomain: req.params.subdomain }).then(account => {
    res.json( { account }) 
  })
})

module.exports = router