import express from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import AWS from 'aws-sdk'

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

  if (account) {
    const accountCreated = await Account.create(account)

    // Connect to subdomain db
    if (env === 'development') {
      await db.connect(process.env.DB_HOST+accountCreated.subdomain+process.env.DB_DEVELOPMENT)
    } else if (env === 'test') {
      await db.connect(process.env.DB_HOST+accountCreated.subdomain+process.env.DB_TEST)
    }

    let userCreated = await User.create(user)

    // Push associated userCreated
    if (userCreated) {
      accountCreated.users.push(userCreated._id)
      accountCreated.save()
        .then(account => {
          console.log('user pushed to new account', account)
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
    }, config.jwtSecret, { expiresIn: '7d' }, (err, emailToken) => {
      if (err) {
        console.log('err token: ', err)
      }
      
      const url = `http://${accountCreated}.lvh.me:3000/login/confirmation/${emailToken}`

      transporter.sendMail({
        to: userCreated.email,
        subject: 'Confirm Email (Toolsio)',
        html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
      })
    })
  }

  if (req.headers.invitation) {
    const { account } = jwt.verify(req.headers.invitation, config.jwtSecret)
    
    // Connect to subdomain db
    if (env === 'development') {
      await db.connect(process.env.DB_HOST+'accounts'+process.env.DB_DEVELOPMENT)
    } else if (env === 'test') {
      await db.connect(process.env.DB_HOST+'accounts'+process.env.DB_TEST)
    }

    const accountInvitedTo = await Account.findOne({ subdomain: account})
    
    // Connect to subdomain db
    if (env === 'development') {
      await db.connect(process.env.DB_HOST+accountInvitedTo.subdomain+process.env.DB_DEVELOPMENT)
    } else if (env === 'test') {
      await db.connect(process.env.DB_HOST+accountInvitedTo.subdomain+process.env.DB_TEST)
    }

    let userCreated = await User.create(user)
    
    // Push associated userCreated
    if (userCreated) {
      accountInvitedTo.save()
        .then(account => {
          account.users.push(userCreated._id)
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
        admin: userCreated.admin, subdomain: accountInvitedTo.subdomain })
    })

    // Create emailToken
    jwt.sign({
      id: userCreated._id,
      email: userCreated.email
    }, config.jwtSecret, { expiresIn: '7d' }, (err, emailToken) => {
      if (err) {
        console.log('err token: ', err)
      }
      
      const url = `http://${accountInvitedTo}.lvh.me:3000/login/confirmation/${emailToken}`

      transporter.sendMail({
        to: userCreated.email,
        subject: 'Confirm Email (Toolsio)',
        html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
      })
    })  
  }

})

// Get user by email
router.get('/:email', (req, res) => {
  User.findOne({ email: req.params.email }).then(user => {
    res.json( { result: user }) 
  })
})

// Get user by email or all users
router.get('/all/users', (req, res) => {
  User.find({}).select('firstName lastName email confirmed').exec((err, users) => {
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
})

// Confirm email
router.post('/account/invitation', (req, res) => {
  
  const email = req.body.email 
  const account = req.headers.subdomain

  // Create emailToken
  jwt.sign({
    email: email,
    account: account
  }, config.jwtSecret, { expiresIn: '7d' }, (err, emailToken) => {
    if (err) {
      console.log('err token: ', err)
    }
     
    const url = `http://${account}.lvh.me:3000/signup/invitation/${emailToken}`
    console.log('url: ', url)
    transporter.sendMail({
      to: email,
      subject: 'Invitation Email (Toolsio)',
      html: `You are invited to join ${account}. Please click this link to accept you invitation and sign up: <a href="${url}">${url}</a>`
    })

    res.json({
      confirmation: 'success',
      result: true
    }) 
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

// Update User fields, Upload to S3
router.put('/update/avatar/:id', async (req, res) => {

  let variables = req.body.variables

  const s3Bucket = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    Bucket: process.env.S3_BUCKET,
    region: 'eu-central-1'
  })

  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: variables.filename,
    Expires: 60,
    ContentType: variables.filetype,
    ACL: 'public-read'
  }

  const signedRequest = await s3Bucket.getSignedUrl('putObject', s3Params)
  const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${variables.filename}`
   
  User.findByIdAndUpdate(req.params.id, {avatar: url}, (err, user) => {
    if (err) {
      console.log(err)
      return
    }

    console.log('avatar field updated', user)
  })

  res.json( { result: {signedRequest: signedRequest, url: url} }) 
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
       console.log("email ", user)
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

