import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  
  Query: {
    getMessage: (parent, { id }, { models }) => models.Message.findOne({ where: { id } }),

    getChannelMessages: (parent, args, { models }) => {
      return models.Message.findAll({ 
        where: { channelId: args.channelId },
        order: [['created_at', 'ASC']] }, { raw: true })
    },

    getSentMessages: (parent, args, { models }) => {
      return models.Message.findAll({ 
        where: { userId: 1 },
        order: [['created_at', 'ASC']] }, { raw: true })
    },

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

    getUnreadCounts: async (parent, args, { models }) => {
      try {
        const unreadCount = await models.Message.count({ 
          where: { isRead: false },
          include: [
            {
              model: models.User,
              where: { id: 1 }
            }
          ]}, { raw: true })

        return {
          success: true,
          unreadCount
        }
      } catch(err) {
        console.log(err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }

    }
  },

  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
      try {
        
        const message = await models.Message.create({ ...args, userId: 1 })

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
  },

  Message: {
    user: ({ userId }, args, { models }) => {

      return models.User.findOne({ where: {id: userId} }, { raw: true })
    } 
  }        
}
