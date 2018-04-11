import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getChannel: requiresAuth.createResolver((parent, { id }, { models }) => models.Channel.findOne({ where: { id } })),

    getChannels: requiresAuth.createResolver((parent, args, { models }) => {
      return models.Channel.findAll({
        include: [
          {
            model: models.User,
            where: { id: 1 }
          }
        ]
      }, { raw: true })
    })
  },

  Mutation: {
    createChannel: requiresAuth.createResolver(async (parent, { name }, { models, user }) => {
      try {
      
        const channel = await models.Channel.findOne({ where: { name } }, { raw: true })
    
        if (channel) {
          return {
            success: false,
            errors: [
              {
                path: 'name',
                message: 'Channel name is already taken'
              }
            ]
          }    
        } else {
          const channel = await models.Channel.create({ name, owner: 1 })
          await models.Member.create({ userId: 1, channelId: channel.id })

          return {
            success: true,
            channel
          }
        }
      } catch (err) {
        console.log(err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }
    }),

    addMemeber: requiresAuth.createResolver(async (parent, { userId, channelId }, { models, user }) => {

      return models.Member.create({ userId: userId, channelId: channelId })
        .then(() => {
          return {
            success: true
          }
        })  
        .catch(err => {
          console.log(err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })    
    })

  },

  Channel: {
    users: ({ id }, args, { models }) => {
      return models.User.findAll({ 
        include: [
          {
            model: models.Channel,
            where: { id: id }
          }
        ]
      }, { raw: true })
    }

  },

  GetChannelAndUsersCountResponse: {
    getUsersCount: ({ id }, args, { models }) => {
      return models.User.count({ 
        include: [
          {
            model: models.Channel,
            where: { id: id }
          }
        ]}, { raw: true })
    }

  }       
          
}