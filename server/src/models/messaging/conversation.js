import mongoose from 'mongoose'

const ConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
})

module.exports = mongoose.model('conversation', ConversationSchema)