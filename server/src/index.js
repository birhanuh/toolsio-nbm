// Setup express
import express from 'express'

import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

// Init app
const app = express()

import accounts from './routes/accounts'
import users from './routes/users'
import api from './routes/api'
//import routes from './routes/index'

// Config
require('dotenv').config()
import config from './config'

// Mongodb connection
import db from './db'

// Authentication package 
import session from 'express-session'
import passport from 'passport'

// View Engine
//app.set('view engine', 'jade')
//app.set('views', [__dirname + '/app/views', __dirname + '/app/views/auth', __dirname + '/app/views/projects'])

// BodyParser and Cookie parser Middleware(Setup code)
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  //cookie: {secure: true}
  cookie: { maxAge: 2628000000 },
  store: new (require('express-sessions'))({
    storage: 'mongodb',
    //instance: mongoose, // optional 
    host: 'localhost', // optional 
    //port: 27017, // optional 
    db: 'toolsio', // optional 
    collection: 'sessions', // optional 
    expire: 86400 // optional 
  })
}))

app.use(passport.initialize())
app.use(passport.session())

let env = process.env.NODE_ENV || 'development'

if (env === 'development') {
  app.locals.pretty = true
}

// app.use(function(req, res, next) {
//   res.locals.isAuthenticated = req.isAuthenticated()
//   next()  
// })

app.use('/accounts', accounts)
app.use('/users', users)
app.use('/api', api)
//app.use('/', routes)

// Middleware function
app.use((req, res) => {
  res.status(404).json({
    errors: {
      confirmation: 'fail',
      message: "Route not yet implemented"
    }
  })
})

// Set port
app.set('port', process.env.PORT)
app.listen(app.get('port'), () => 
  console.log('Server started on port: ' + process.env.PORT)
)

// Connect to mognodb
if (env === 'development') {
  db.connect(process.env.DB_HOST+process.env.DB_DEVELOPMENT)
} else if (env === 'test') {
  db.connect(process.env.DB_HOST+process.env.DB_TEST)
}



