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
import { apolloUploadExpress } from 'apollo-upload-server'
import DataLoader from 'dataloader'

// Authentication packages 
import session from 'express-session'
import passport from 'passport'
import jwt from 'jsonwebtoken'

// Subscription packages 
import { createServer } from 'http'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'

// Init app
const app = express()

// env
require('dotenv').config()

// Config
import jwtConfig from '../config/jwt.json'

// Models
import models from './models'
import { refreshAuthTokens } from './utils/authentication'

// Batch functions 
import { userBatcher, customerBatcher, projectBatcher, saleBatcher } from './utils/batchFunctions'

// Schema
const types = fileLoader(path.join(__dirname + '/types'), { recursive: true })
const typeDefs = mergeTypes(types) 

// Resolvers
const resolvers =  mergeResolvers(fileLoader(path.join(__dirname + '/resolvers'), { recursive: true })) 

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

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

// Add authToken exist checker middleware
app.use(async (req, res, next) => {
  
  // Parse subdomain 
  let subdomain = req.headers.subdomain
  console.log('subdomain: ', subdomain)
  // Parse authToken 
  const authToken = req.headers['x-auth-token']

  if (authToken && authToken !== 'null') {
    try {
      const { user } = jwt.verify(authToken, jwtConfig.jwtSecret1)     
      req.user = user
       
    } catch (err) { 
      let refreshAuthToken = req.headers['x-refresh-auth-token']
      const newAuthTokens = await refreshAuthTokens(authToken, refreshAuthToken, models, jwtConfig.jwtSecret1, jwtConfig.jwtSecret2)
      
      if (newAuthTokens.authToken && newAuthTokens.refreshAuthToken) {
        res.set('Access-Control-Expose-Headers', 'x-auth-token', 'x-refresh-auth-token')
        res.set('x-auth-token', newAuthTokens.authToken)
        res.set('x-refresh-auth-token', newAuthTokens.refreshAuthToken)
      }
      req.user = newAuthTokens.user
    }
  }
  next()
})

const endpointURL = '/graphql'

app.use(
  endpointURL, 
  bodyParser.json(),
  apolloUploadExpress(), 
  graphqlExpress(req => ({ 
    schema,
    context: {
      models,
      subdomain: req.headers.subdomain,
      user: req.user,
      //user: { id: 1 },
      SECRET: jwtConfig.jwtSecret1,
      SECRET2: jwtConfig.jwtSecret2,
      userLoader: new DataLoader(userId => userBatcher(userId, models)),
      customerLoader: new DataLoader(customerIds => customerBatcher(customerIds, models)),
      projectLoader: new DataLoader(projectIds => projectBatcher(projectIds, models)),
      saleLoader: new DataLoader(saleIds => saleBatcher(saleIds, models))
    }
  }))
)

app.use(
  '/graphiql', 
  graphiqlExpress({ endpointURL: endpointURL, 
    subscriptionsEndpoint: 'ws://localhost:8080/subscriptions' 
  })
)

app.use('/uploads', express.static('uploads'))

/**
app.use(session({
  secret: config.jwtSecret,
  resave: false,
  saveUninitialized: false,
  //cookie: {secure: true}
  cookie: { maxAge: 2628000000 },
  store: new (require('connect-pg-simple')(session))({
    conString : process.env.DB_HOST + process.env.POSTGRES_DB
  })
}))
**/
app.use(passport.initialize())
app.use(passport.session())

if (process.env.NODE_ENV === 'development') {
  app.locals.pretty = true
}

// app.use(function(req, res, next) {
//   res.locals.isAuthenticated = req.isAuthenticated()
//   next()  
// })

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
app.set('port', process.env.SERVER_PORT || 8080)

const server = createServer(app)

// app.listen(app.get('port'), () => 
//   console.log('Server started on port: ' + process.env.SERVER_PORT || 8080)
// )
server.listen(app.get('port'), () => {
  new SubscriptionServer({
    execute,
    subscribe,
    schema: schema,
    onConnect: async ({authToken, refreshAuthToken}) => {
      
      if (authToken && refreshAuthToken) {      
        try {
          const { user } = jwt.verify(authToken, jwtConfig.jwtSecret1)
          return { models, user }           
        } catch (err) {
          const newAuthTokens = await refreshAuthTokens(authToken, refreshAuthToken, models, jwtConfig.jwtSecret1, jwtConfig.jwtSecret2)
          return { models, user: newAuthTokens.user }
        }
      }
      return { models }
    }
  }, {
      server: server,
      path: '/subscriptions',
    })
    console.log('Server started on port: ' + process.env.SERVER_PORT || 8080)
    console.log('Environment: ' + process.env.NODE_ENV || 'development')
    console.log('------------------------')
})



// // Connect to mognodb
// if (env === 'development') {
//   db.connect(process.env.DB_HOST+'accounts'+process.env.POSTGRES_DB)
// } else if (env === 'test') {
//   db.connect(process.env.DB_HOST+'accounts'+process.env.DB_TEST)
// }

// // If the Node process ends, close the Mongoose connection 
// process.on('SIGINT', function() {  
//   db.close() 
// })



