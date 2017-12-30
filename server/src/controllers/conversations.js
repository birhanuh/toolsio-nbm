import Conversation from '../models/messaging/conversation'
import Message from '../models/messaging/message'
import User from '../models/user'
import mongoose from 'mongoose'

export default {

  find: (req, callback) => {

    const currentUserId = mongoose.Types.ObjectId(req.session.passport.user)

    // Only return one message from each conversation to display as sinppet
    Conversation.find({ participants: req.session.passport.user }).select('_id').exec((err, conversations) => {
      if (err) {
        callback(err, null)
        return
      }
      
      // Set up empty array to hold conversations + most recent message
      let inbox = []
      let allConversations = []
      let countUnread = 0
      let countDraft = 0

      conversations.map(conversation => {
        Message.find({ conversationId: conversation._id }).sort({createdAt: 'asc'}).limit(1).populate({ path: 'author', select: 'firstName lastName' }).exec((err, message) => {
          if(err) {
            callback(err, null)
            return
          }

          if (message.length !== 0 && !currentUserId.equals(message[0].author._id)) {
            
            inbox.push(message)
            allConversations.push(message)
            
            if (!message[0].isRead) {
              countUnread += 1
            }

            if (!message.isDraft) {
              countDraft += 1
            }

          } else {
            allConversations.push([])
          }

          if(allConversations.length === conversations.length) {
            
            let allConversationsUnreadDraft = {
              countUnread: countUnread,
              countDraft: countDraft,
              conversations: inbox
            }

            callback(null, allConversationsUnreadDraft)
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
        let inbox = []
        let allConversations = []
        let countUnread = 0
        let countDraft = 0

        conversations.map(conversation => {
          Message.find({ conversationId: conversation._id }).sort({createdAt: 'asc'}).limit(1).populate({ path: 'author', select: 'firstName lastName' }).exec((err, message) => {
            if(err) {
              callback(err, null)
              return
            }

            if (message.length !== 0 && !currentUserId.equals(message[0].author._id)) {
              
              inbox.push(message)
              allConversations.push(message)

              if (!message[0].isRead) {
                countUnread += 1
              }

              if (!message.isDraft) {
                countDraft += 1
              }
            } else {
              allConversations.push([])
            }

            if(allConversations.length === conversations.length) {

              let allConversationsUnreadDraft = {
                countUnread: countUnread,
                countDraft: countDraft,
                conversations: inbox
              }

              callback(null, allConversationsUnreadDraft)
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
        let sent = []
        let allConversations = []
        let countUnread = 0
        let countDraft = 0

        conversations.map(conversation => {
          Message.find({ conversationId: conversation._id, author: {_id: req.session.passport.user} }).sort({createdAt: 'asc'}).limit(1).populate({ path: 'author', select: 'firstName lastName' }).exec((err, message) => {
            if(err) {
              callback(err, null)
              return
            }

            if (message.length !== 0 && currentUserId.equals(message[0].author._id)) {
              
              sent.push(message)
              allConversations.push(message)

              if (!message[0].isRead) {
                countUnread += 1
              }

              if (!message.isDraft) {
                countDraft += 1
              }
            } else {
              allConversations.push([])
            }

            if(allConversations.length === conversations.length) {
              let allConversationsUnreadDraft = {
                countUnread: countUnread,
                countDraft: countDraft,
                conversations: sent
              }

              callback(null, allConversationsUnreadDraft)
            }
          })
        })
        
      }) 
      return
    }

    Message.find({ conversationId: id }).select('createdAt body author conversationId').sort('-createdAt').populate({ path: 'author', select: 'firstName lastName admin' }).exec((err, messages) => {
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
    console.log('conversationId: ', req.query)
    if (req.query.conversationId) {
      const message = new Message({
        conversationId: req.params.conversationId,
        title: req.body.title,
        body: req.body.body,
        author: req.session.passport.user // Get id of current user from session
      })

      Message.create(message, (err, message) => {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, [message])
      })
    } else {
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
          callback(null, [message])
        })
       
      })
    }
    
  }


}