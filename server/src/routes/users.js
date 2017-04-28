import express from 'express'
import bcrypt from 'bcrypt'
import { Validation } from '../utils'
import isEmpty from 'lodash/isEmpty'
import jwt from 'jsonwebtoken'
import config from '../config'

import User from '../models/user'

let router = express.Router();

function validateRegistrationInput(data, otherValidation) {
  let { errors } = otherValidation(data)

  return User.findAsync({ email: data.email }).then(user => {
    if (user[0]) { 
      if (user[0].email === data.email) { errors.email = 'There is user with such email' }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  })
}

// Get user
router.get('/:identifier', (req, res) => {
  User.findAsync({ email: req.params.identifier }).then(user => {
    res.json( { user }) 
  })
})

// Register User
router.post('/register', function(req, res) {
  validateRegistrationInput(req.body, Validation.validateRegistrationInput).then(({ errors, isValid }) => {
    if (isValid) {
      //res.json({ success: true })
      const { firstName, lastName, email, password } = req.body
      const password_digest = bcrypt.hashSync(password, 10)

      var newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password_digest
      });

      newUser.save()
        .then(user => res.json({ success: true }))
        .catch(err => res.status(500).json({ error: err }))

    } else {  
      res.status(400).json(errors)
    } 
  })
  
})

router.post('/login', (req, res) => {
  const { email, password } = req.body

  User.findAsync({ email: email }).then(user => {
      if (user) {
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

