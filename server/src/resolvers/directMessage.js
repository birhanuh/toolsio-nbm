import { PubSub, withFilter } from 'graphql-subscriptions'

import requiresAuth,  { requiresDirectMessageAccess } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'
import { processUpload } from '../utils/uploadFile'

const pubsub = new PubSub()

const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE'

export default {
  Subscription: {
    getNewDirectMessage: {
      subscribe: requiresDirectMessageAccess.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE), 
        (payload, args, { models, user }) => {
          
          return (payload.getNewDirectMessage.senderId === user.id && payload.getNewDirectMessage.receiverId === args.receiverId)
          || (payload.getNewDirectMessage.senderId === args.receiverId && payload.getNewDirectMessage.receiverId === user.id)
        }
      ))
    }
  },

  Query: {
    getDirectMessage: requiresAuth.createResolver((parent, { id }, { models }) => models.DirectMessage.findOne({ where: { id } }, { raw: true })),

    getDirectMessages: requiresAuth.createResolver((parent, args, { models, user }) => 
      models.DirectMessage.findAll({ 
        where: { [models.sequelize.Op.or]: [
          { [models.sequelize.Op.and]: [{ receiverId: args.receiverId, senderId: user.id }]},
          { [models.sequelize.Op.and]: [{ senderId: args.receiverId, receiverId: user.id }]}
          ] },
        order: [['created_at', 'ASC']] }, { raw: true })),

    getDirectMessageUsers: requiresAuth.createResolver((parent, args, { models }) => 
      models.sequelize.query('select distinct on (u.id) u.id, u.first_name, u.email from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id)', {
          model: models.User,
          raw: true,
        })),

    getSentDirectMessages: requiresAuth.createResolver((parent, args, { models, user }) => 
      models.DirectMessage.findAll({ 
          where: { senderId: user.id },
          order: [['created_at', 'ASC']] }, { raw: true })
        ),

    getInboxDirectMessages: requiresAuth.createResolver((parent, args, { models, user }) => 
      models.DirectMessage.findAll({ 
        include: [
          {
            model: models.User,
            where: { receiverId: user.id }
          }
        ],
        order: [['created_at', 'ASC']] }, { raw: true })),

    getUnreadDirectMessagesCount: requiresAuth.createResolver((parent, args, { models, user }) => 
      models.DirectMessage.count({ 
          where: { receiverId: user.id, isRead: false }
        }, { raw: true })
        .then(count => {
          return {
            count
          }
        })
        .catch(err => {
          console.log('err: ', err)
        })),

    getDirectMessageUsersWithUnreadMessagesCount: requiresAuth.createResolver((parent, args, { models, user }) => 
      models.sequelize.query('SELECT count(*), sender_id FROM direct_messages WHERE receiver_id='+user.id+' GROUP BY sender_id', {
          model: models.DirectMessage,
          raw: true
        }) 
        .then(result => {
          return {
            success: true,
            usersUnreadDirectMessagesCount: result
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
    createDirectMessage: requiresAuth.createResolver(async (parent, { file, ...args }, { models, user }) => {
      try {

        const messageData = args
        
        if (file) {
          const uploadFile = await processUpload(file)
          messageData.uploadPath = uploadFile.path
          messageData.mimetype = uploadFile.mimetype
        }
         
        const message = await models.DirectMessage.create({ ...messageData, senderId: user.id })

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
    })  
  },

  // createChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
  //     try {
  //       const member = await models.Member.findOne(
  //         { where: { teamId: args.teamId, userId: user.id } },
  //         { raw: true },
  //       );
  //       if (!member.admin) {
  //         return {
  //           ok: false,
  //           errors: [
  //             {
  //               path: 'name',
  //               message: 'You have to be the owner of the team to create channels',
  //             },
  //           ],
  //         };
  //       }

  //       const response = await models.sequelize.transaction(async (transaction) => {
  //         const channel = await models.Channel.create(args, { transaction });
  //         if (!args.public) {
  //           const members = args.members.filter(m => m !== user.id);
  //           members.push(user.id);
  //           const pcmembers = members.map(m => ({ userId: m, channelId: channel.dataValues.id }));
  //           await models.PCMember.bulkCreate(pcmembers, { transaction });
  //         }
  //         return channel;
  //       });

  //       return {
  //         ok: true,
  //         channel: response,
  //       };
  //     } catch (err) {
  //       console.log(err);
  //       return {
  //         ok: false,
  //         errors: formatErrors(err, models),
  //       };
  //     }
  //   }),
  
  DirectMessage: {
    uploadPath: parent => parent.uploadPath && process.env.DNS+parent.uploadPath,
    
    user: ({ user, senderId }, args, { models }) => {

      if (user) {
        return user
      }
      return models.User.findOne({ where: {id: senderId} }, { raw: true })            
    } 
  },

  UsersUnreadDirectMessagesCount: {    
    user: ({ user, sender_id }, args, { models }) => {

      if (user) {
        return user
      }
      return models.User.findOne({ where: {id: sender_id} }, { raw: true })            
    } 
  }

}
