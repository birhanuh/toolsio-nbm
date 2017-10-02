import mongoose from 'mongoose'

export default {
  drop: function(collectionName, mongoURI) {  
    mongoose.createConnection(mongoURI, {useMongoClient: true}, function(err, db) {    
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

  fixtures: (mongoURI, schema, data) => {
    mongoose.createConnection(mongoURI, {useMongoClient: true}, (err, db) => {    
      if (err) throw err
      schema.collection.insertMany(data, (err,r) => {
        console.log('collection inserted')
      })    
    })
  }
}