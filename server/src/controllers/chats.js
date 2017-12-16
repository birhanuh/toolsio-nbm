import Conversation from '../models/conversation'
import Message from '../models/message'
import User form '../models/user'

export default {

  find: (query, callback) => {
    // Only return one message from each conversation to display as sinppet
    Conversation.find({ participants: query.user._id }).select('_id').exec((err, conversations) => {
      if (err) {
        callback(err, null)
        return
      }

      // Set up empty array to hold conversations + most recent message
      let fullConversations = []
      conversations.map(conversation = {
        Message.find({ conversationId: conversation._id}).sort('-createdAt').limit(1).populate({ path: 'author', select: 'profile.firstName profile.lastName' }).exec((err, message) => {
          if(err) {
            callback(err, null)
            return
          }

          fullConversations.push(message)

          if (fullConversations.length === conversations.length) {
            callback(null, fullConversations)
          }
        })
      })
    }) 
  }
}