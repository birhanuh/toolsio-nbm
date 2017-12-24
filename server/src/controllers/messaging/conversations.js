import Conversation from '../../models/messaging/conversation'
import Message from '../../models/messaging/message'
import User from '../../models/user'

export default {

  find: (req, callback) => {
    // Only return one message from each conversation to display as sinppet
    Conversation.find({ participants: req.session.passport.user }).select('_id').exec((err, conversations) => {
      if (err) {
        callback(err, null)
        return
      }

      // Set up empty array to hold conversations + most recent message
      let fullConversations = []

      conversations.length !== 0 && conversations.map(conversation => {
        Message.find({ conversationId: conversation._id}).sort('createdAt').limit(1).populate({ path: 'author', select: 'profile.firstName profile.lastName' }).exec((err, message) => {
          if(err) {
            callback(err, null)
            return
          }

          fullConversations.push(message)
        })
      })

      callback(null, fullConversations)
    }) 
  },

  findById: (id, callback) => {
    // Only return one message from each conversation to display as sinppet
    Conversation.findById(id, (err, conversation) => {
      if (err) {
        callback(err, null)
        return
      }

      // Set up empty array to hold messages
      let messages = []

      Message.find({ conversationId: conversation._id}).sort('createdAt').limit(1).populate({ path: 'author', select: 'profile.firstName profile.lastName' }).exec((err, message) => {
        if(err) {
          callback(err, null)
          return
        }

        messages.push(message)
      })

      callback(null, messages)
     
    }) 
  },

  create: (reqBody, callback) => {
     Conversation.create(reqBody, { $push: { participants: reqBody.recipientId }}, (err, conversation) => {
      if (err) {
        callback(err, null)
        return
      }

      const message = new Message({
        conversationId: conversation._id,
        body: reqBody.body,
        author: reqBody.session.passport.user // Get id of current user from session
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