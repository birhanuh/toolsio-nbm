import express from 'express'

import Account from '../models/account'

let router = express.Router()

let env = process.env.NODE_ENV || 'development'

// Mongodb connection
import db from '../db'

// Get regisetred user
router.get('/:subdomain', async (req, res) => {

  // Connect to accounts db
  if (env === 'development') {
    await db.connect(process.env.DB_HOST+'accounts'+process.env.DB_DEVELOPMENT)
  } else if (env === 'test') {
    await db.connect(process.env.DB_HOST+'accounts'+process.env.DB_TEST)
  }

  let account = await Account.find({ subdomain: req.params.subdomain })

  if (account.length !== 0 ) {    
    res.json( { result: account[0] }) 
  } else {
    res.json( { result: null }) 
  }

})

module.exports = router