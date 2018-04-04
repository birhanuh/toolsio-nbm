import { PubSub, withFilter } from 'graphql-subscriptions'

import { requiresAuth, requiresChannelAccess } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

const pubsub = new PubSub()

const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE'

export default {
  Subscription: {
    getNewDirectMessage: {
      subscribe: requiresChannelAccess.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE), 
        (payload, args) => payload.getNewDirectMessage.receiverId === args.receiverId
      ))
    }
  },

  Query: {
    getDirectMessage: (parent, { id }, { models }) => models.DirectMessage.findOne({ where: { id } }, { raw: true }),

    getDirectMessages: (parent, args, { models, user }) => {
      return models.DirectMessage.findAll({ 
        where: { [models.sequelize.Op.or]: [
          { [models.sequelize.Op.and]: [{ receiverId: args.receiverId, senderId: user.id }]},
          { [models.sequelize.Op.and]: [{ senderId: args.receiverId, receiverId: user.id }]}
          ] },
        order: [['created_at', 'ASC']] }, { raw: true })
    },

     getDirectMessageUsers: (parent, { receiverId }, { models }) => models.sequelize.query(' select * from users as user join direct_messages ')

  },

  Mutation: {
    createDirectMessage: async (parent, args, { models, user }) => {
      try {
        console.log('user ', user)
        const message = await models.DirectMessage.create({ ...args, senderId: user.id })

        // Do both asynchronously
        const asyncFunc = async () => {
          const author = await models.User.findOne({ where: {id: user.id} }, { raw: true })

          pubsub.publish(NEW_DIRECT_MESSAGE, { 
            receiverId: args.receiverId, 
            getNewDirectMessage: {...message.dataValues, user: author.dataValues} 
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

  DirectMessage: {
    user: ({ user, senderId }, args, { models }) => {

      if (user) {
        return user
      }
      return models.User.findOne({ where: {id: senderId} }, { raw: true })            
    } 
  }

}
