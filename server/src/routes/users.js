import express from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from '../config'

import User from '../models/user'
import Account from '../models/account'

let router = express.Router()

let LocalStrategy = require('passport-local').Strategy

// Register User
// router.post('/register', function(req, res) {

//   User.create(req.body)
//     .then(user => 
//       req.login(user._id, function(err) {
//         res.json({ success: true })
//       })
//     ).catch(err => 
//       res.status(500).json({ 
//         errors: {
//           confirmation: 'fail',
//           message: err
//         }
//       })
//     )
// })

router.post('/register', function(req, res) {
  const { account, user } = req.body

  User.create(user).then(user => {
    Account.create(account).then(account => {
      
      // Push associated user
      account.users.push(user)
      account.save().then(account => {

        // Push associated account
        user.account = account
        user.save().then(user => {
          req.login(user, function(err) {
            res.json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, 
              admin: user.admin, subdomain: user.account.subdomain })
          })
        }).catch(err => 
          res.status(500).json({ 
            errors: {
              confirmation: 'fail',
              message: err
            }
          })
        )
      }).catch(err => 
        res.status(500).json({ 
          errors: {
            confirmation: 'fail',
            message: err
          }
        })
      )
    }).catch(err => 
      res.status(500).json({ 
        errors: {
          confirmation: 'fail',
          message: err
        }
      })
    )
  }).catch(err => 
    res.status(500).json({ 
      errors: {
        confirmation: 'fail',
        message: err
      }
    })
  )
})

// Get user by email or all users
router.get('/:resource', (req, res) => {
  if (req.params.resource === 'email') {
    User.find({ email: req.params.email }).then(user => {
      res.json( { user }) 
    })
  } else if (req.params.resource === 'all') {
    User.find({}).select('firstName').exec(function(err, users) {
      if (err) {
        res.status(500).json({ 
          errors: {
            confirmation: 'fail',
            message: err
          }
        })
        return
      }
     
      res.json({ 
        confirmation: 'success',
        results: users 
      })
    })
  }
})

// Login User
router.post('/login', passport.authenticate('local'), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.

  if (req.user.confirmed) {
    Account.findById(req.user.accountId, function(err, account) { 
      if (err) {
        res.status(500).json({ 
          errors: {
            confirmation: 'fail',
            message: err
          }
        })
        return
      }

      res.json({ _id: req.user._id, firstName: req.user.firstName, lastName: req.user.lastName, email: req.user.email, 
        admin: req.user.admin, subdomain: account.subdomain })
    })
  } else {
    res.status(500).json({ 
      errors: {
        confirmation: 'fail',
        message: 'Please confirm your email to login'
      }
    })
    return
  }

})

router.post('/logout', function(req, res) {
  req.logout()
  req.session.destroy(function(err) {
    if (err) {
      res.status(500).json({ 
        errors: {
          confirmation: 'fail',
          message: err
        }
      })
      return
    }
    res.json({ success: true })
  })
})

passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user)
  })
})

passport.use(new LocalStrategy({usernameField: 'email'},
  function(email, password, done) {
    User.getUserByEmail(email, function(err, user) {
      if (err) throw err
      if (!user) {
        return done(null, false, {
          errors: {
            confirmation: 'fail',
            message: {
              errors: {
                email: {
                  message: 'Incorrect email.'
                }
              }
            }
          }
        })
      }
      
      User.comparePassword(password, user.password, function(err, isMatch) {
        if(err) throw err
        
        if(isMatch){
          return done(null, user)
        } else {
          return done(null, false, {
            errors: {
              confirmation: 'fail',
              message: {
                errors: {
                  password: {
                    message: 'Incorrect password.'
                  }
                }
              }
            }
          })
        }
      })
    })
  }
))

module.exports = router

