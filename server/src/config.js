// Don't commit this file to your public repos
// Setup express
import express from 'express'
// Init app
const app = express()

let dns

if (app.settings.env === 'development') {
  dns = 'localhost'
} else if (app.settings.env === 'production') {
  dns = 'https://toolsio.com'
}

export default {

  // Your mongo auth uri goes here
  // e.g. mongodb://username:server@mongoserver:10059/somecollection
  // nationalpark is the name of my mongo database
  mongoose_test: `mongodb://${dns}/toolsio_test`,
  mongoose: `mongodb://${dns}/toolsio`,

  // jwt
  jwtSecret: 'somesecretkeyforjsonwebtoken'

}