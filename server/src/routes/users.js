import express from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from '../config'

import User from '../models/User'

let router = express.Router()

let LocalStrategy = require('passport-local').Strategy

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
// router.post('/login', passport.authenticate('local', {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     //res.redirect('/users/' + req.user.username)
//     successRedirect: '/dashboard',
//     failureRedirect: '/login'
// }))

router.post('/logout', function(req, res) {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.post('/login', passport.authenticate('local'), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.json({ firstName: req.user.firstName, lastName: req.user.lastName, email: req.user.email, 
    admin: req.user.admin })
})

// router.post('/login', (req, res) => {
//   const { email, password } = req.body

//   User.find({ email: email }).then(user => {
//     if (user[0]) {
//       if (bcrypt.compareSync(password, user[0].password)) {
//         const token = jwt.sign({
//           id: user[0]._id,
//           email: user[0].email
//         }, config.secret)
//         res.json({ token })
//       } else {
//         res.status(401).json({ errors: { form: 'Invalid Credentials.' } }) 
//       }
//     } else {
//       res.status(401).json({ errors: { form: 'Invalid Credentials.' } }) 
//     }  
//   })
// })

passport.serializeUser(function(userId, done) {
  done(null, userId)
})

passport.deserializeUser(function(userId, done) {
  User.getUserById(userId, function(err, user) {
    done(err, userId)
  })
})

passport.use(new LocalStrategy({usernameField: 'email'},
  function(email, password, done) {
    User.getUserByEmail(email, function(err, user) {
      if (err) throw err
      if (!user) {
        return done(null, false, {message: 'Incorrect email.'})
      }
      
      User.comparePassword(password, user.password, function(err, isMatch) {
        if(err) throw err
        
        if(isMatch){
          return done(null, user)
        } else {
          return done(null, false, {message: 'Invalid password'})
        }
      })
    })
  }
))

module.exports = router

