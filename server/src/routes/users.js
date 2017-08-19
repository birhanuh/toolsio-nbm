import express from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from '../config'

import User from '../models/User'

let router = express.Router()

// Get regisetred user
router.get('/:identifier', (req, res) => {
  User.find({ email: req.params.identifier }).then(user => {
    res.json( { user }) 
  })
})

router.get('/', (req, res) => {
  console.log(req.user)
  console.log(req.isAuthenticated())
})

// Register User
router.post('/register', function(req, res) {

  User.create(req.body)
    .then(user => 
      req.login(user._id, function(err) {
        //res.json({ success: true })
        res.redirect('/')
      })
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

  User.find({ email: email }).then(user => {
    if (user[0]) {
      if (bcrypt.compareSync(password, user[0].password)) {
        const token = jwt.sign({
          id: user[0]._id,
          email: user[0].email
        }, config.secret)
        res.json({ token })
      } else {
        res.status(401).json({ errors: { form: 'Invalid Credentials.' } }) 
      }
    } else {
      res.status(401).json({ errors: { form: 'Invalid Credentials.' } }) 
    }  
  })
})

passport.serializeUser(function(user_id, done) {
  done(null, user_id)
})

passport.deserializeUser(function(user_id, done) {
  done(null, user_id)
})

module.exports = router

