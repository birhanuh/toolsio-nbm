import mongoose from 'mongoose'
import Promise from 'bluebird'

export default {
  connect: (mongoURI) => {     
    
    // Close previous connection
    mongoose.connection.close()

    // Connect to new one
    mongoose.connect(mongoURI, {useMongoClient: true})
    .then(() => {
      console.log('DB CONNECTION SUCCESS: '+mongoURI)
    })
    .catch((error) => {
      console.log('DB CONNECTION FAILED: '+error)
    })

    // Promisify mongoose with bluebird
    mongoose.Promise = require('bluebird')
  },

  dropCollection: function(collectionName) {  
       
    /* Clean collections */
    mongoose.connection.collections[collectionName].drop( function(err) {
      console.log('collection dropped')
    })
  },

  close: function(collectionName) {  
     
    /* Close connection */
    mongoose.connection.close()
  },

  drop: function(collectionName) {  
     
    /* Drop the DB */
    mongoose.connection.db.dropDatabase()
  }

}


