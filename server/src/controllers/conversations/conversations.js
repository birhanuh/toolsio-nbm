import Conversation from '../../models/conversations/conversation'
import Message from '../../models/conversations/message'
import User from '../../models/user'
import mongoose from 'mongoose'

export default {

  find: (req, callback) => {

    const _id = mongoose.Types.ObjectId(req.session.passport.user)

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

  },

  findById: (req, callback) => {
    
    let id = req.params.id

    const currentUserId = mongoose.Types.ObjectId(req.session.passport.user)

    if (id === 'inbox') {
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

            if (!currentUserId.equals(message[0].author._id)) {
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

    if (id === 'sent') {
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

    Message.find({ conversationId: id }).sort('-createdAt').populate({ path: 'author', select: 'firstName lastName admin' }).exec((err, messages) => {
      if (err) {
        callback(err, null)
        return
      }

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