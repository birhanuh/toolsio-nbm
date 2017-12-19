import Conversation from '../../models/messaging/conversation'
import Message from '../../models/messaging/message'
import User from '../../models/user'

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
      conversations.map(conversation => {
        Message.find({ conversationId: conversation._id}).sort('createdAt').limit(1).populate({ path: 'author', select: 'profile.firstName profile.lastName' }).exec((err, message) => {
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
  },

  create: (reqBody, callback) => {
     Conversation.create(reqBody, { $push: { participants: reqBody.recipient }}, (err, conversation) => {
      if (err) {
        callback(err, null)
        return
      }

      const message = new Message({
        conversationId: conversation._id,
        body: reqBody.composedMessage,
        author: reqBody.user._id
      })

      Message.create(message, (err, message) => {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, message)
      })
     
    })
  }


}