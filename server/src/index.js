// Setup express
import express from 'express'

import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

// Init app
const app = express()

import users from './routes/users'
import api from './routes/api'
//import routes from './routes/index'

// Mongodb credentials
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
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());

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

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

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
app.set('port', (process.env.PORT || 8080))
app.listen(app.get('port'), () => 
  console.log('Server started on port: ' + app.get('port'))
);

// Setup mongoose 
let mongoURI = config.mongoose

db.connect(mongoURI)



