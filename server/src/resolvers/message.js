import { PubSub, withFilter } from 'graphql-subscriptions'

import requiresAuth, { requiresChannelAccess } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'
import { processUpload } from '../utils/uploadFile'

const pubsub = new PubSub()

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE'

export default {
  Subscription: {
    getNewChannelMessage: {
      subscribe: requiresChannelAccess.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE), 
        (payload, args) => payload.channelId === args.channelId
      ))
    }
  },

  Query: {
    getMessage: requiresAuth.createResolver((parent, { id }, { models }) => models.Message.findOne({ where: { id } }, { raw: true })),

    getChannelMessages: requiresAuth.createResolver((parent, args, { models }) => {
      return models.Message.findAll({ 
        where: { channelId: args.channelId },
        order: [['created_at', 'ASC']] }, { raw: true })
    })

  },

  Mutation: {
    createMessage: requiresAuth.createResolver(async (parent, { file, ...args }, { models, user }) => {
      try {
        
        const messageData = args

        if (file) {
          const uploadFile = await processUpload(file)
          messageData.uploadPath = uploadFile.path
          messageData.mimetype = uploadFile.mimetype
        }

        const message = await models.Message.create({ ...messageData, userId: user.id })

        // Do both asynchronously
        const asyncFunc = async () => {
          const author = await models.User.findOne({ where: {id: user.id} }, { raw: true })

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
        console.log('err: ', err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }
    })  
  },

  Message: {
    uploadPath: parent => parent.uploadPath && process.env.DNS+parent.uploadPath,

    user: ({ user, userId }, args, { models }) => {

      if (user) {
        return user
      }
      return models.User.findOne({ where: {id: userId} }, { raw: true })            
    } 
  }        
}
