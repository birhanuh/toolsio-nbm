import Conversation from '../models/messaging/conversation'
import Message from '../models/messaging/message'
import User form '../models/user'

export default {

  find: (query, callback) => {
    Message.find({ conversationId: query.conversationId }).select('createdAt body author').sort('-createdAt').populate({ path: 'author', select: 'firstName lastName' }).exec((err, messages) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, messages)
    })
  }
}