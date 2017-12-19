import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, required: true },
  body: { type: String, required: [true, "Message is required."] },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp. 
})

module.exports = mongoose.model('message', MessageSchema) 