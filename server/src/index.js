// Setup express
import express from 'express'

import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import cors from 'cors'
// Authentication package 
import session from 'express-session'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import socketEvents from './socket/socketEvents'

// Init app
const app = express()

// Routes
//import accounts from './routes/accounts'
//import users from './routes/users'
import api from './routes/api'
//import routes from './routes/index'

// Config
require('dotenv').config()
import config from './config'

// Mongodb connection
import db from './db'

// Models
import models from './models'
import refreshToken from './utils/authentication'

// Schema
const types = fileLoader(path.join(__dirname + '/types'))
const typeDefs = mergeTypes(types) 

// Resolvers
const resolvers =  mergeResolvers(fileLoader(path.join(__dirname + '/resolvers'))) 

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

// View Engine
//app.set('view engine', 'jade')
//app.set('views', [__dirname + '/app/views', __dirname + '/app/views/auth', __dirname + '/app/views/projects'])

// Allow CORS 
app.use(cors('*'))

// BodyParser and Cookie parser Middleware(Setup code)
app.use(logger('dev'))

const graphqlEndPoint = '/graphql'

app.use(graphqlEndPoint, bodyParser.json(), 
  graphqlExpress(req => ({ 
    schema,
    context: {
      models,
      user: req.user,
      SECRET: config.jwtSecret,
      SECRET2: config.jwtSecret2
    }
  }))
)

app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndPoint }))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

// Add token exist checker middleware
app.use(async (req, res, next) => {
  
  // Parse subdomain 
  //let subdomain = req.headers.subdomain || (req.headers.host.split('.').length >= 3 ? req.headers.host.split('.')[0] : false)

   // Parse token 
  let token = req.headers['x-token']

  if (token) {
    try {
      const { user } = jwt.verify(token, config.secret)
      req.user = user
    
    } catch (err) {
      let refreshToken = req.headers['x-refresh-token']
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2)
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token', 'x-refresh-token')
        res.set('x-token', newTokens.token)
        res.set('x-refresh-token', newTokens.refreshToken)
      }
      req.user = newTokens.user
    }
  }
  next()
})

/**
app.use(session({
  secret: config.jwtSecret,
  resave: false,
  saveUninitialized: false,
  //cookie: {secure: true}
  cookie: { maxAge: 2628000000 },
  store: new (require('connect-pg-simple')(session))({
    conString : process.env.DB_HOST + process.env.DB_DEVELOPMENT
  })
}))
**/
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

// app.use('/accounts', accounts)
// app.use('/users', users)
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
app.set('port', process.env.SERVER_PORT)


// sync() will create all table if then doesn't exist in database
models.sequelize.sync().then(() => {
  app.listen(app.get('port'), () => 
    console.log('Server started on port: ' + process.env.SERVER_PORT)
  )
})

//const io = require('socket.io').listen(8080)
//socketEvents(io)

// // Connect to mognodb
// if (env === 'development') {
//   db.connect(process.env.DB_HOST+'accounts'+process.env.DB_DEVELOPMENT)
// } else if (env === 'test') {
//   db.connect(process.env.DB_HOST+'accounts'+process.env.DB_TEST)
// }

// // If the Node process ends, close the Mongoose connection 
// process.on('SIGINT', function() {  
//   db.close() 
// })

/*
mutation {
  registerUser(firstName: "test1", lastName: "test1", email: "test3@toolsio.com", password: "sfpws" ) {
    success
    user {
      id
    }
    errors {
      message
    }
  }
}
*/

