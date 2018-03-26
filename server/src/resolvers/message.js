import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  
  Query: {
    getMessage: (parent, { id }, { models }) => models.Message.findOne({ where: { id } }),
    getInboxMessages: (parent, args, { models }) => {
      return models.Message.findAll({ 
        include: [
          {
            model: models.User,
            where: { id: 1 }
          }
        ],
        order: [['created_at', 'ASC']] }, { raw: true })
    },

    getSentMessages: (parent, args, { models }) => {
      return models.Message.findAll({ 
        where: { author: 1 },
        order: [['created_at', 'ASC']] }, { raw: true })
    },

    getReadAndDraftedCounts: async (parent, args, { models }) => {
      try {
        const unreadCount = await models.Message.count({ 
          where: { isRead: false },
          include: [
            {
              model: models.User,
              where: { id: 1 }
            }
          ]}, { raw: true })

        const draftedCount = await models.Message.count({ 
          where: { isDrafted: true },
          include: [
            {
              model: models.User,
              where: { id: 1 }
            }
          ]}, { raw: true })
        console.log('unreadCount ', unreadCount)
        return {
          success: true,
          unreadCount,
          draftedCount
        }
      } catch(err) {
        console.log(err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }

    },
  },

  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
      try {
        console.log('user ', user)
        const message = await models.Message.create({ ...args, author: 1 })

        await models.Conversation.create({ recipientId: args.recipientId, messageId: message.id })

        return {
          success: true,
          message
        }
      } catch (err) {
        console.log(err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }
    }  
  }        
}