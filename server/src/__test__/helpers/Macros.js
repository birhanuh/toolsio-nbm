import mongoose from 'mongoose'

export default {

  fixtures: (mongoURI, schema, data) => {

    mongoose.createConnection(mongoURI, {useMongoClient: true}, (err, db) => {    
      if (err) throw err
      schema.collection.insertMany(data, (err,r) => {
        console.log('collection inserted')
      })    
    })
  }
}