import mongoose from 'mongoose'

export default {
  dropDatabase: () => {   
    
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