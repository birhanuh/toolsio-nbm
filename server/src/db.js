import mongoose from 'mongoose'
import Promise from 'bluebird'

export default {
  connect: (mongoURI) => {     
    
    // Promisify mongoose with bluebird
    mongoose.Promise = require('bluebird')

    // Close previous connection
    //mongoose.connection.close()

    // Connect to new one
    return mongoose.connect(mongoURI, {useMongoClient: true})
    .then(() => {
      console.log('DB CONNECTION SUCCESS: '+mongoURI)
    })
    .catch((error) => {
      console.log('DB CONNECTION FAILED: '+error)
    })
  },

  dropCollection: function(collectionName) {  
       
    /* Clean collections */
    return mongoose.connection.collections[collectionName].drop( function(err) {
      console.log('collection dropped')
    })
  },

  close: function(collectionName) {  
     
    /* Close connection */
    return mongoose.connection.close()
  },

  drop: function(collectionName) {  
     
    /* Drop the DB */
    return mongoose.connection.db.dropDatabase()
  }

}


