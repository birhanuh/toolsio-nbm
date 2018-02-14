import express from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

// Config
require('dotenv').config()
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

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

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

      // Create emailToken
      jwt.sign({
        id: user._id,
        email: user.email
      }, config.jwtSecret, { expiresIn: '1d' }, (err, emailToken) => {
        if (err) {
          console.log('err token: ', err)
        }
        
        const url = `http://localhost:3000/login/confirmation/${emailToken}`

        transporter.sendMail({
          to: user.email,
          subject: 'Confirm Email (Toolsio)',
          html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
        })
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
})

// Get user by email or all users
router.get('/:email', (req, res) => {
  User.find({ email: req.params.email }).then(user => {
    res.json( { user }) 
  })
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

// Confirm email
router.get('/confirmation/:token/', (req, res) => {
  
  const { id } = jwt.verify(req.params.token, config.jwtSecret)

  User.findByIdAndUpdate({ _id: id }, { confirmed: true }, {new: true}, (err, user) => {
    if (err) {
      res.status(500).json({ 
        errors: {
          confirmation: 'fail',
          message: err
        }
      })
      return
    }

    if (user !== null) {
      res.json({ confirmed: true })
    } else {
      res.json({ confirmed: false })
    }
  })

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

