import mongoose from 'mongoose'

const MessageSchema = mongoose.Schema({
  conversationId: { type: mongoose.Schema.ObjectId, required: true  }
  body: { type: String, required: true }
  author: { type: mongoose.Schema.ObjectId, ref: 'user' }
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp. 
})

module.exports = mongoose.model('Message', MessageSchema) 