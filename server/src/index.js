// Setup express
import express from "express";

import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import cors from "cors";
import DataLoader from "dataloader";

// Authentication packages
import session from "express-session";
import passport from "passport";
import jwt from "jsonwebtoken";

// Subscription packages
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";

// Init app
const app = express();

// env
require("dotenv").config();

// Models
import models from "./models";
import { refreshAuthTokens } from "./utils/authentication";

// Batch functions
import {
  userBatcher,
  customerBatcher,
  projectBatcher,
  saleBatcher
} from "./utils/batchFunctions";

// Schema
const types = fileLoader(path.join(__dirname + "/types"), { recursive: true });
const typeDefs = mergeTypes(types);

// Resolvers
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname + "/resolvers"), { recursive: true })
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// View Engine
//app.set('view engine', 'jade')
//app.set('views', [__dirname + '/app/views', __dirname + '/app/views/auth', __dirname + '/app/views/projects'])

// Allow CORS
app.use(cors("*"));

// BodyParser and Cookie parser Middleware(Setup code)
app.use(logger("dev"));

app.use(cookieParser());

// Subdomain
let subdomain;

// Add authToken exist checker middleware
app.use(async (req, res, next) => {
  // Parse assign subdomain globally
  subdomain = req.headers.subdomain;
  console.log("subdomain: ", subdomain);

  // Parse authToken
  const authToken = req.headers["x-auth-token"];

  if (authToken && authToken !== "null") {
    try {
      const { user } = jwt.verify(authToken, process.env.JWTSECRET1);
      req.user = user;
    } catch (err) {
      let refreshAuthToken = req.headers["x-refresh-auth-token"];
      const newAuthTokens = await refreshAuthTokens(
        authToken,
        refreshAuthToken,
        models,
        subdomain,
        process.env.JWTSECRET1,
        process.env.JWTSECRET2
      );

      if (newAuthTokens.authToken && newAuthTokens.refreshAuthToken) {
        res.set(
          "Access-Control-Expose-Headers",
          "x-auth-token",
          "x-refresh-auth-token"
        );
        res.set("x-auth-token", newAuthTokens.authToken);
        res.set("x-refresh-auth-token", newAuthTokens.refreshAuthToken);
      }
      req.user = newAuthTokens.user;
    }
  }
  next();
});

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      models,
      subdomain: req.headers.subdomain ? req.headers.subdomain : "public",
      //subdomain: 'testa',
      user: req.user,
      //user: { id: 1 },
      SECRET: process.env.JWTSECRET1,
      SECRET2: process.env.JWTSECRET2,
      userLoader: new DataLoader(usersId =>
        userBatcher(usersId, models, req.headers.subdomain)
      ),
      customerLoader: new DataLoader(customersId =>
        customerBatcher(customersId, models, req.headers.subdomain)
      ),
      projectLoader: new DataLoader(projectsId =>
        projectBatcher(projectsId, models, req.headers.subdomain)
      ),
      saleLoader: new DataLoader(salesId =>
        saleBatcher(salesId, models, req.headers.subdomain)
      )
    };
  }
});

apolloServer.applyMiddleware({ app });

app.use("/uploads", express.static("uploads"));

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
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "development") {
  app.locals.pretty = true;
}

// app.use(function(req, res, next) {
//   res.locals.isAuthenticated = req.isAuthenticated()
//   next()
// })

// Middleware function
app.use((req, res) => {
  res.status(404).json({
    errors: {
      confirmation: "fail",
      message: "Route not yet implemented"
    }
  });
});

// Set port
app.set("port", process.env.SERVER_PORT || 8080);

const httpServer = createServer(app);

// app.listen(app.get('port'), () =>
//   console.log('Server started on port: ' + process.env.SERVER_PORT || 8080)
// )

httpServer.listen(app.get("port"), () => {
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema: schema,
      onConnect: async ({ authToken, refreshAuthToken }) => {
        if (authToken && refreshAuthToken) {
          try {
            const { user } = jwt.verify(authToken, process.env.JWTSECRET1);
            return { models, subdomain, user };
          } catch (err) {
            const newAuthTokens = await refreshAuthTokens(
              authToken,
              refreshAuthToken,
              models,
              subdomain,
              process.env.JWTSECRET1,
              process.env.JWTSECRET2
            );
            return { models, subdomain, user: newAuthTokens.user };
          }
        }
        return { models };
      }
    },
    {
      server: httpServer,
      path: "/subscriptions"
    }
  );
  console.log("Server started on port: " + process.env.SERVER_PORT || 8080);
  console.log("Environment: " + process.env.NODE_ENV || "development");
  console.log("------------------------");
});
