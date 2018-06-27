import { withFilter } from 'graphql-subscriptions'

import requiresAuth,  { requiresDirectMessageAccess } from '../../middlewares/authentication'
import { formatErrors } from '../../utils/formatErrors'
import { processUpload } from '../../utils/uploadFile'

import pubsub from '../../utils/pubsub'

const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE'

export default {
  Subscription: {
    getNewDirectMessage: {
      subscribe: requiresDirectMessageAccess.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE), 
        (payload, args, { user }) => {
          
          return (payload.getNewDirectMessage.senderId === user.id && payload.getNewDirectMessage.receiverId === args.receiverId)
          || (payload.getNewDirectMessage.senderId === args.receiverId && payload.getNewDirectMessage.receiverId === user.id)
        }
      ))
    }
  },

  Query: {
    getDirectMessage: requiresAuth.createResolver((parent, { id }, { models, subdomain }) => models.DirectMessage.findOne({ where: { id }, searchPath: subdomain }, { raw: true })),

    getDirectMessages: requiresAuth.createResolver((parent, { receiverId, cursor }, { models, subdomain, user }) => {
      const options = { 
        where: { [models.sequelize.Op.or]: [
          {[models.sequelize.Op.and]: [{ receiverId: receiverId, senderId: user.id }]},
          {[models.sequelize.Op.and]: [{ senderId: receiverId, receiverId: user.id }]} ]
        },
        order: [['created_at', 'DESC']], limit: 10, searchPath: subdomain }
   
      if (cursor) {
        options.where.created_at = {
          [models.sequelize.Op.lt]: cursor
        }
      }

      return models.DirectMessage.findAll(options, { raw: true })
    }),

    getDirectMessageUsers: requiresAuth.createResolver((parent, args, { models, subdomain }) => 
      models.sequelize.query('select distinct on (u.id) u.id, u.first_name, u.email from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id)', {
          model: models.User,
          raw: true,
          searchPath: subdomain
        })),

    getSentDirectMessages: requiresAuth.createResolver((parent, args, { models, subdomain, user }) => 
      models.DirectMessage.findAll({ 
          where: { senderId: user.id },
          order: [['created_at', 'ASC']], searchPath: subdomain }, { raw: true })
        ),

    getInboxDirectMessages: requiresAuth.createResolver((parent, args, { models, subdomain, user }) => 
      models.DirectMessage.findAll({ 
        include: [
          {
            model: models.User,
            where: { receiverId: user.id }
          }
        ],
        order: [['created_at', 'ASC']], searchPath: subdomain }, { raw: true })),

    getUnreadDirectMessagesCount: requiresAuth.createResolver((parent, args, { models, subdomain, user }) => 
      models.DirectMessage.count({ 
          where: { receiverId: user.id, senderId: { [models.sequelize.Op.ne]: user.id }, isRead: false }, searchPath: subdomain
        }, { raw: true })
        .then(count => {
          return {
            count
          }
        })
        .catch(err => {
          console.log('err: ', err)
        })),

    getUnreadDirectMessagesCountSender: requiresAuth.createResolver((parent, args, { models, subdomain, user }) => 
      models.sequelize.query('SELECT count(*), sender_id FROM direct_messages WHERE receiver_id = '+user.id+' AND sender_id<>'+user.id+' AND is_read=false GROUP BY sender_id', {
          model: models.DirectMessage,
          raw: true,
          searchPath: subdomain
        }) 
        .then(result => {
          return {
            success: true,
            unreadDirectMessagesCountSender: result
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        }))

  },

  Mutation: {
    createDirectMessage: requiresAuth.createResolver(async (parent, { file, ...args }, { models, subdomain, user }) => {
      try {

        const messageData = args
        
        if (file) {
          const uploadFile = await processUpload(file)
          messageData.uploadPath = uploadFile.path
          messageData.mimetype = uploadFile.mimetype
        }
         
        const message = await models.DirectMessage.create({ ...messageData, senderId: user.id }, { searchPath: subdomain })

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
        console.log('err: ', err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }
    }),

    markDirectMessagesAsRead: requiresAuth.createResolver((parent, args, { models, user }) => 
      models.DirectMessage.update({isRead: true}, { where: {receiverId: user.id, senderId: args.senderId}, searchPath: subdomain })
        .then(() => {  
          return {
            success: true
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        }))  
  },
  
  DirectMessage: {
    uploadPath: parent => parent.uploadPath && `${process.env.SERVER_URL || 'http://localhost:8080/'}${parent.uploadPath}`,
    
    user: ({ user, senderId }, args, { models }) => {

      if (user) {
        return user
      }
      return models.User.findOne({ where: {id: senderId}, searchPath: subdomain }, { raw: true })            
    } 
  }

}
