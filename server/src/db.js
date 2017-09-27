import mongoose from 'mongoose'
import Promise from 'bluebird'

// Promisify mongoose with bluebird
mongoose.Promise = require('bluebird')

export default {
  connect: (mongoURI) => { 
    mongoose.connect(mongoURI, {useMongoClient: true})
    .then(() => {
      console.log('DB CONNECTION SUCCESS: '+mongoURI)
    })
    .catch((error) => {
      console.log('DB CONNECTION FAILED: '+error)
    })
  }

}


