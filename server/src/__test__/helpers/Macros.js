import mongoose from 'mongoose'

export default {
  clean: function(collectionName) {  
       
    /* Clean collections */
    mongoose.connection.collections[collectionName].drop( function(err) {
      console.log('collection dropped')
    })

    /* Close connection */
    mongoose.connection.close()
  },

  drop: function(collectionName) {  
     
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