import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: [true, "Title is required."] },
  body: { type: String, required: [true, "Message is required."] },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  isRead: {type: Boolean, default: false},
  isDraft: {type: Boolean, default: false}
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp. 
})

module.exports = mongoose.model('message', MessageSchema) 