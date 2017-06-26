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
      db.collection(collectionName,function(err, collection){
        collection.remove({},function(err, removed){
        })
      })
    })
  }

}

// Promisify mongoose functions
Promise.promisifyAll(mongoose)
