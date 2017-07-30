import express from 'express'
import bcrypt from 'bcrypt'
import { Validation } from '../utils'
import isEmpty from 'lodash/isEmpty'
import jwt from 'jsonwebtoken'
import config from '../config'

import User from '../models/User'

let router = express.Router()

// Get regisetred user
router.get('/:identifier', (req, res) => {
  User.findAsync({ email: req.params.identifier }).then(user => {
    res.json( { user }) 
  })
})

// Register User
router.post('/register', function(req, res) {

  User.create(req.body)
    .then(user => 
      res.json({ success: true })
    ).catch(err => 
      res.status(500).json({ 
        errors: {
          confirmation: 'fail',
          message: err
        }
      })
    )

})

// Login User
router.post('/login', (req, res) => {
  const { email, password } = req.body

  User.findAsync({ email: email }).then(user => {
    if (user[0]) {
      if (bcrypt.compareSync(password, user[0].password)) {
        const token = jwt.sign({
          id: user[0]._id,
          email: user[0].email
        }, config.jwtSecret)
        res.json({ token })
      } else {
        res.status(401).json({ errors: { form: 'Invalid Credentials' } }) 
      }
    } else {
      res.status(401).json({ errors: { form: 'Invalid Credentials' } }) 
    }  
  })
})

module.exports = router

