import express from 'express'
import bcrypt from 'bcrypt'
import { Validation } from '../src/utils'
import isEmpty from 'lodash/isEmpty'

import User from '../models/user'

let router = express.Router();

function validateInput(data, otherValidation) {
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
  validateInput(req.body, Validation.validateInput).then(({ errors, isValid }) => {
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

module.exports = router

