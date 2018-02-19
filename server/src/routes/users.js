import express from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

// Config
import config from '../config'

let env = process.env.NODE_ENV || 'development'

// Mongodb connection
import db from '../db'

import User from '../models/user'
import Account from '../models/account'

let router = express.Router()

let LocalStrategy = require('passport-local').Strategy

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

router.post('/register', async (req, res) => {
  const { account, user } = req.body

  let accountCreated = await Account.create(account)

  // Connect to subdomain db
  if (env === 'development') {
    await db.connect(process.env.DB_HOST+accountCreated.subdomain+process.env.DB_DEVELOPMENT)
  } else if (env === 'test') {
    await db.connect(process.env.DB_HOST+accountCreated.subdomain+process.env.DB_TEST)
  }

  let userCreated = await User.create(user)

  // Connect to subdomain db
  if (env === 'development') {
    await db.connect(process.env.DB_HOST+'accounts'+process.env.DB_DEVELOPMENT)
  } else if (env === 'test') {
    await db.connect(process.env.DB_HOST+'accounts'+process.env.DB_TEST)
  }

  // Push associated userCreated
  if (userCreated) {
    accountCreated.save()
      .then(account => {
        account.users.push(userCreated)
      })
      .catch(err => 
        console.log('new account err', err)
      )
  } else {
    console.log('userCreated is null')
  }  

  req.login(userCreated, function(err) {
    if (err) {
      res.status(500).json({ 
        errors: {
          confirmation: 'fail',
          message: err
        }
      })
      return
    }
    res.json({ _id: userCreated._id, firstName: userCreated.firstName, lastName: userCreated.lastName, email: userCreated.email, 
      admin: userCreated.admin, subdomain: accountCreated.subdomain })
  })

  // Create emailToken
  jwt.sign({
    id: userCreated._id,
    email: userCreated.email
  }, config.jwtSecret, { expiresIn: '1d' }, (err, emailToken) => {
    if (err) {
      console.log('err token: ', err)
    }
    
    const url = `http://localhost:3000/login/confirmation/${emailToken}`

    transporter.sendMail({
      to: userCreated.email,
      subject: 'Confirm Email (Toolsio)',
      html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
    })
  })

})

// Get user by email or all users
router.get('/:email', (req, res) => {
  User.find({ email: req.params.email }).then(user => {
    res.json( { user }) 
  })
})

// Login User
// router.post('/login', passport.authenticate('local'), function(req, res) {
//   // If this function gets called, authentication was successful.
//   // `req.user` contains the authenticated user.
//   if (req.user.confirmed) {
//     res.json({ _id: req.user._id, firstName: req.user.firstName, lastName: req.user.lastName, email: req.user.email, 
//       admin: req.user.admin })
    
//   } else {
//     res.status(500).json({ 
//       errors: {
//         confirmation: 'fail',
//         message: 'Please confirm your email to login'
//       }
//     })
//   }

// })

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    
    if (err) { 
      return next(err); 
    }

    if (!user) { 
      res.status(500).json({ 
        errors: {
          confirmation: 'fail',
          message: {
            errors: {
              email: {
                message: 'Incorrect email.'
              },
              password: {
                message: 'Incorrect password.'
              }
            }
          }
        }
      })
      return
    }
    
    if (user) {
      req.logIn(user, function(err) {
        if (err) { 
          return next(err) 
        }

        if (user.confirmed) {
          res.json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, 
            admin: user.admin, subdomain: req.headers.subdomain })        
        } else {
          res.status(500).json({ 
            errors: {
              confirmation: 'fail',
              message: 'Please confirm your email to login'
            }
          })
        }
      })
      return
    }
  })(req, res, next)
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

passport.use(new LocalStrategy({
            usernameField: 'email',
            passReqToCallback: true},
  async function(req, email, password, done) {

    // Connect to subdomain db
    if (env === 'development') {
      await db.connect(process.env.DB_HOST+req.headers.subdomain+process.env.DB_DEVELOPMENT)
    } else if (env === 'test') {
      await db.connect(process.env.DB_HOST+req.headers.subdomain+process.env.DB_TEST)
    }

    User.getUserByEmail(email, function(err, user) {
      if (err) {
        return done(err)
      }

      if (!user) {
        return done(null, false)
      }
      
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) {
          return done(err)
        }
        
        if(isMatch){
          return done(null, user)
        } else {
          return done(null, false,)
        }
      })
    })
  }
))

module.exports = router

