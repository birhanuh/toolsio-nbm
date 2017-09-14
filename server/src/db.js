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
  },

  drop: () => {   
    
    /* Drop the DB */
    mongoose.connection.db.dropDatabase()
  },

  fixtures: (mongoURI, schema, data) => {
    mongoose.createConnection(mongoURI, {useMongoClient: true}, (err, db) => {    
      if (err) throw err
      schema.collection.insertMany(data, (err,r) => {
        console.log('collection inserted')
      })    
    })
  }

}


