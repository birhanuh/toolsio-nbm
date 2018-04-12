import { PubSub, withFilter } from 'graphql-subscriptions'

import { requiresAuth, requiresDirectMessageAccess } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

const pubsub = new PubSub()

const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE'
//requiresDirectMessageAccess.createResolver(
export default {
  Subscription: {
    getNewDirectMessage: {
      subscribe: requiresAuth.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE), 
        (payload, args, { models, user }) => {
          
          return (payload.getNewDirectMessage.senderId === user.id && payload.getNewDirectMessage.receiverId === args.receiverId)
          ||(payload.getNewDirectMessage.senderId === args.receiverId && payload.getNewDirectMessage.receiverId === user.id)
        }
      ))
    }
  },

  Query: {
    getDirectMessage: requiresAuth.createResolver((parent, { id }, { models }) => models.DirectMessage.findOne({ where: { id } }, { raw: true })),

    getDirectMessages: requiresAuth.createResolver((parent, args, { models, user }) => {
      return models.DirectMessage.findAll({ 
        where: { [models.sequelize.Op.or]: [
          { [models.sequelize.Op.and]: [{ receiverId: args.receiverId, senderId: user.id }]},
          { [models.sequelize.Op.and]: [{ senderId: args.receiverId, receiverId: user.id }]}
          ] },
        order: [['created_at', 'ASC']] }, { raw: true })
    }),

    getDirectMessageUsers: requiresAuth.createResolver((parent, args, { models }) => 
      models.sequelize.query('select distinct on (u.id) u.id, u.first_name, u.email from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id)', {
          model: models.User,
          raw: true,
        }))

  },

  Mutation: {
    createDirectMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        
        const message = await models.DirectMessage.create({ ...args, senderId: user.id })

        // Do both asynchronously
        const asyncFunc = async () => {
          const author = await models.User.findOne({ where: {id: user.id} }, { raw: true })

          pubsub.publish(NEW_DIRECT_MESSAGE, { 
            receiverId: args.receiverId, 
            senderId: user.id,
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
    })  
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
