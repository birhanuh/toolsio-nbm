import Conversation from '../models/messaging/conversation'
import Message from '../models/messaging/message'
import User form '../models/user'

export default {

  find: (req, type, callback) => {
    Message.find({ conversationId: id }).select('createdAt body author conversationId').sort('-createdAt').populate({ path: 'author', select: 'firstName lastName admin' }).exec((err, messages) => {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, messages)
    })
  }
}