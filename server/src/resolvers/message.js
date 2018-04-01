import { PubSub, withFilter } from 'graphql-subscriptions'

import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

const pubsub = new PubSub()

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE'

export default {
  Subscription: {
    getNewChannelMessage: {
      subscribe: withFilter(requiresAuth.createResolver(async (parent, { channelId }, { models, user }) => {
        // Check if part of the memeber
        const memeber = await models.Member.findOne({ where: { channelId, userId: user.id } })

        if (!member) {
          throw new Error("You have to be a member of the channel to subscribe for it's messages")
        }
        return pubsub.asyncIterator(NEW_CHANNEL_MESSAGE)
      }), 
      (payload, args) => {
        return payload.getNewChannelMessage.channelId === args.channelId
      })
      // subscribe: withFilter(() => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE), 
      //   (payload, args) => {
      //     return payload.getNewChannelMessage.channelId === args.channelId
      //   })
    }
  },

  Query: {
    getMessage: (parent, { id }, { models }) => models.Message.findOne({ where: { id } }, { raw: true }),

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
        
        const message = await models.Message.create({ ...args, userId: 2 })

        // Do both asynchronously
        const asyncFunc = async () => {
          const author = await models.User.findOne({ where: {id: 2} }, { raw: true })

          pubsub.publish(NEW_CHANNEL_MESSAGE, { 
            channelId: args.channelId, 
            getNewChannelMessage: {...message.dataValues, user: author.dataValues} 
          })
        }
        
        asyncFunc()

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
    user: ({ user, userId }, args, { models }) => {

      if (user) {
        return user;
      }
      return models.User.findOne({ where: {id: userId} }, { raw: true })            
    } 
  }        
}
