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
import jwtConfig from './config/jwt'

// Models
import models from './models'
import { refreshAuthTokens } from './utils/authentication'

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

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

// Add authToken exist checker middleware
app.use(async (req, res, next) => {
  
  // Parse subdomain 
  let subdomain = req.headers.subdomain
  console.log('subdomain: ', subdomain)
  // Parse authToken 
  const authToken = req.headers['x-auth-token']

  if (authToken !== "null") {
    try {
      const { user } = jwt.verify(authToken, jwtConfig.jwtSecret)
      
      req.user = user
    
    } catch (err) {
      let refreshAuthToken = req.headers['x-refresh-auth-token']
      const newAuthTokens = await refreshAuthTokens(authToken, refreshAuthToken, models, jwtConfig.jwtSecret, jwtConfig.jwtSecret2)
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

// GraphQL
const graphqlEndPoint = '/graphql'

app.use(
  graphqlEndPoint, 
  bodyParser.json(),
  apolloUploadExpress(), 
  graphqlExpress(req => ({ 
    schema,
    context: {
      models,
      subdomain: req.headers.subdomain,
      user: req.user,
      SECRET: jwtConfig.jwtSecret,
      SECRET2: jwtConfig.jwtSecret2
    }
  }))
)

app.use(
  '/graphiql', 
  graphiqlExpress({ endpointURL: graphqlEndPoint, 
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

const server = createServer(app)

// app.listen(app.get('port'), () => 
//   console.log('Server started on port: ' + process.env.SERVER_PORT)
// )
server.listen(app.get('port'), () => {
  new SubscriptionServer({
    execute,
    subscribe,
    schema: schema,
    onConnect: async ({authToken, refreshAuthToken}, webSocket) => {
      
      if (authToken && refreshAuthToken) {
      
        try {
          const { user } = jwt.verify(authToken, jwtConfig.jwtSecret)
          return { models, user }           
        } catch (err) {
          const newAuthTokens = await refreshAuthTokens(authToken, refreshAuthToken, models, jwtConfig.jwtSecret, jwtConfig.jwtSecret2)
          return { models, user: newAuthTokens.user }
        }
    }

    return { models }
  }}, {
    server: server,
    path: '/subscriptions',
  })
  console.log('Server started on port: ' + process.env.SERVER_PORT)
  console.log('Environment: ' + process.env.NODE_ENV)
  console.log('------------------------')
})



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
  registerUser(firstName: "testa", lastName: "testa", email: 
      "testa@toolsio.com", password: "ppppp", subdomain: "testa", industry: "testa" ) {
      success
      user {
        id
      } 
      errors {
        path
        message
      }
    }
}

mutation {
  createProject(name: "Project 1", deadline: 1521243824165, status: "new", 
    description: "Desciption 1...", customerId: 1) {
    success
    project {
      id
      name
      deadline
      status
      description
    }
    errors {
      path
      message
    }
  }
}

mutation createCustomer($name: String!, $vatNumber: String!, $email: String!, $phoneNumber: String!, $isContactIncludedInInvoice: Boolean!, $street: String, $postalCode: String, $region: String, $country: String) {
  createCustomer(name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, 
    postalCode: $postalCode, region: $region, country: $country) {
    success
    errors {
      path
      message
    }
  }
}

query {
  getProjects {
    name
    deadline
  }
}

mutation {
  createInvoice(deadline: 1521822820714, interestInArrears: 2, status:"new",
    total: 30, projectId: 1, customerId: 1) {
    success
    invoice {
      id
    }
    errors {
      path
      message
    }
  }
}

mutation {
  createMessage(body: "Testa...", channelId: 1 ) {
      success
      message {
        id
      } 
      conversation {
        id
      }
      errors {
        path
        message
      }
    }
}

mutation {
  createChannel(name: "channel1") {
    success
    channel {
      id
      name
    }
    errors {
      path
      message
    }
  }
}

query {
  getChannel(id: 1) {
    id
    name
    users {
      id
      email
    }
  }
}
*/

