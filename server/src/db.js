import mongoose from 'mongoose'
import Promise from 'bluebird'

export default {
  connect: function(mongoURI) { 
    mongoose.connect(mongoURI, function(err, res) {
      if (err) {
        console.log('DB CONNECTION FAILED: '+err)
      } else {
        console.log('DB CONNECTION SUCCESS: '+mongoURI)
      }
    })
  },

  drop: function(collectionName, mongoURI) {   
    mongoose.createConnection(mongoURI, function(err, db) {    
      /* Drop the DB */
      //mongoose.connection.db.dropDatabase();

      /* Drop collections */
      mongoose.connection.collections[collectionName].drop( function(err) {
        console.log('collection dropped');
      })

      /* Close connection */
      mongoose.connection.close()
    })
  },

  fixtures: function(mongoURI, schema, data) {
    mongoose.createConnection(mongoURI, function(err, db) {    
      schema.collection.insertMany(data, function(err,r) {
        console.log('collection inserted')
      })    
    })
  }

}

// Promisify mongoose with bluebird
Promise.promisifyAll(mongoose)