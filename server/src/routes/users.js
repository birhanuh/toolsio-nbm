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

  const { subdomain, industry } = req.body.account
  const { first_name, last_name, email, password } = req.body.user

  if (subdomain) {
    const accountCreated = await Account.forge({ subdomain, industry }, { hasTimestamps: true }).save()

    let userCreated = await User.forge({ account: subdomain, first_name, last_name, email, password }, { hasTimestamps: true }).save()
    
    // Login userCreated
    req.login(userCreated.attributes, function(err) {
      console.log('userCreated.attributes ', userCreated.attributes)
      if (err) {
        res.status(500).json({ 
          errors: {
            confirmation: 'fail',
            message: err
          }
        })
        return
      }
      res.json({ id: userCreated.attributes.id, first_name: userCreated.attributes.first_name, last_name: userCreated.attributes.last_name, email: userCreated.attributes.email, 
        admin: userCreated.attributes.admin, account: userCreated.attributes.account })
    }) 

    // Create emailToken
    jwt.sign({
      id: userCreated.attributes.id,
      email: userCreated.attributes.email
    }, config.jwtSecret, { expiresIn: '7d' }, (err, emailToken) => {
      if (err) {
        console.log('err token: ', err)
      }
      
      const url = `http://${accountCreated}.lvh.me:3000/login/confirmation/${emailToken}`

      transporter.sendMail({
        to: userCreated.attributes.email,
        subject: 'Confirm Email (Toolsio)',
        html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
      })
    })
  }

  if (req.headers.invitation) {
    const { account } = jwt.verify(req.headers.invitation, config.jwtSecret)

    const accountInvitedTo = await Account.findOne({ subdomain: account})
    
    // Connect to subdomain db
    if (env === 'development') {
      await db.connect(process.env.DB_HOST+accountInvitedTo.subdomain+process.env.DB_DEVELOPMENT)
    } else if (env === 'test') {
      await db.connect(process.env.DB_HOST+accountInvitedTo.subdomain+process.env.DB_TEST)
    }

    let userCreated = await User.create(user)
    
    // Push associated userCreated.attributes
    if (userCreated.attributes) {
      accountInvitedTo.save()
        .then(account => {
          account.users.push(userCreated.attributes.id)
        })
        .catch(err => 
          console.log('new account err', err)
        )
    } else {
      console.log('userCreated.attributes is null')
    }

    req.login(userCreated.attributes, function(err) {
      
      if (err) {
        res.status(500).json({ 
          errors: {
            confirmation: 'fail',
            message: err
          }
        })
        return
      }
      res.json({ id: userCreated.attributes.id, first_name: userCreated.attributes.first_name, last_name: userCreated.attributes.last_name, email: userCreated.attributes.email, 
        admin: userCreated.attributes.admin, subdomain: accountInvitedTo.subdomain })
    })

    // Create emailToken
    jwt.sign({
      id: userCreated.attributes.id,
      email: userCreated.attributes.email
    }, config.jwtSecret, { expiresIn: '7d' }, (err, emailToken) => {
      if (err) {
        console.log('err token: ', err)
      }
      
      const url = `http://${accountInvitedTo}.lvh.me:3000/login/confirmation/${emailToken}`

      transporter.sendMail({
        to: userCreated.attributes.email,
        subject: 'Confirm Email (Toolsio)',
        html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
      })
    })  
  }

})

// Get user by email
router.get('/:email', async (req, res) => {

  // Connect to subdomain db
  if (req.headers.subdomain) {
    if (env === 'development') {
      await db.connect(process.env.DB_HOST+req.headers.subdomain+process.env.DB_DEVELOPMENT)
    } else if (env === 'test') {
      await db.connect(process.env.DB_HOST+req.headers.subdomain+process.env.DB_TEST)
    }
  }

  User.where({ email: req.params.email }).fetch()
    .then(user => {
      res.json( { result: user }) 
    })
})

// Get user by email or all users
router.get('/all/users', (req, res) => {
  User.find({}).select('first_name last_name email confirmed').exec((err, users) => {
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
//     res.json({ id: req.user.id, first_name: req.user.first_name, last_name: req.user.last_name, email: req.user.email, 
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
        console.log('user ', user)
        if (user.confirmed) {
          res.json({ id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, 
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

  User.findByIdAndUpdate({ id: id }, { confirmed: true }, {new: true}, (err, user) => {
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
router.post('/avatar', async (req, res) => {

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

  res.json( { result: {signedRequest: signedRequest, url: url} }) 
})

// Update Account fields
router.put('/update/:id', async (req, res) => {

  const subdomain = req.headers.subdomain

  // Connect to accounts db
  if (env === 'development') {
    await db.connect(process.env.DB_HOST+subdomain+process.env.DB_DEVELOPMENT)
  } else if (env === 'test') {
    await db.connect(process.env.DB_HOST+subdomain+process.env.DB_TEST)
  }
  
  let user = await User.findOne({ id: req.params.id })
  let previousUrl = user.avatar

  const s3Bucket = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    Bucket: process.env.S3_BUCKET,
    region: 'eu-central-1'
  })

  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: 'avatars'+previousUrl
  }

  s3Bucket.deleteObject(s3Params, (err, data) => {
    if (err) {
      console.log('err', err)
      return
    }
    console.log('Deleted from s3Bucket', data)
  })
  
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
    if (err) {
      console.log('err', err)
      return
    } 

    console.log('User updated', user)
    res.json({ result: user })    
  })
 
})

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.where({ id: id }).fetch()
    .then(user => {
      done(null, user)
    })
    .catch(err => {
      done(err, null)
    })
})

passport.use(new LocalStrategy({
            usernameField: 'email',
            passReqToCallback: true},
  async function(req, email, password, done) {

    let query = {email: email}
    User.where(query).fetch()
      .then(user => {
        if (user) {
          User.comparePassword(password, user.attributes.password, function(err, isMatch) {
            if (err) {
              return done(err)
            }
            
            if(isMatch){
              return done(null, user.attributes)
            } else {
              return done(null, false,)
            }
          })
        } else {
          return done(null, false)
        }
      })
      .catch(err => { throw err })

  }
))

module.exports = router

