import Conversation from '../../models/messaging/conversation'
import Message from '../../models/messaging/message'
import User from '../../models/user'
import mongoose from 'mongoose'

export default {

  find: (req, type, callback) => {
    
    const _id = mongoose.Types.ObjectId(req.session.passport.user)

    if (type === 'inbox') {
      // Only return one message from each conversation to display as sinppet
      Conversation.find({ participants: req.session.passport.user }).select('_id').exec((err, conversations) => {
        if (err) {
          callback(err, null)
          return
        }
        
        // Set up empty array to hold conversations + most recent message
        let fullConversations = []

        conversations.map(conversation => {
          Message.find({ conversationId: conversation._id }).sort({createdAt: 'asc'}).limit(1).populate({ path: 'author', select: 'firstName lastName' }).exec((err, message) => {
            if(err) {
              callback(err, null)
              return
            }

            if (!_id.equals(message[0].author._id)) {
              fullConversations.push(message)
            } else {
              fullConversations.push([])
            }

            if(fullConversations.length === conversations.length) {
              callback(null, fullConversations)
            }
          })
        })
        
      }) 
      return
    } 

    if (type === 'sent') {
      Conversation.find({ participants: req.session.passport.user }).select('_id').exec((err, conversations) => {
        if (err) {
          callback(err, null)
          return
        }
        
        // Set up empty array to hold conversations + most recent message
        let fullConversations = []

        conversations.map(conversation => {
          Message.find({ conversationId: conversation._id, author: {_id: req.session.passport.user} }).sort({createdAt: 'asc'}).limit(1).populate({ path: 'author', select: 'firstName lastName' }).exec((err, message) => {
            if(err) {
              callback(err, null)
              return
            }

            fullConversations.push(message)

            if(fullConversations.length === conversations.length) {
              callback(null, fullConversations)
            }
          })
        })
        
      }) 
      return
    }

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

  create: (req, callback) => {
    
    const conversation = new Conversation({
      participants: [req.session.passport.user, req.body.recipientId]
    })

    Conversation.create(conversation, (err, newConversation) => {
      if (err) {
        callback(err, null)
        return
      }

      const message = new Message({
        conversationId: newConversation._id,
        title: req.body.title,
        body: req.body.body,
        author: req.session.passport.user // Get id of current user from session
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