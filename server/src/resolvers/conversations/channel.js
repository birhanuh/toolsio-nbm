import requiresAuth from '../../middlewares/authentication'
import { formatErrors } from '../../utils/formatErrors'

export default {
  Query: {
    getChannel: requiresAuth.createResolver((parent, { id }, { models, subdomain }) => models.Channel.findOne({ where: { id }, searchPath: subdomain })),

    getChannelsUsersCount:  requiresAuth.createResolver((parent, args, { models, subdomain, user }) => 
      models.Channel.findAll({
        include: [
          {
            model: models.User,
            where: { id: user.id }, 
            searchPath: subdomain
          }
        ]
      }, { raw: true }))

  },

  Mutation: {
    createChannel: requiresAuth.createResolver(async (parent, { name, isPublic }, { models, subdomain }) => {
      try {
      
        const channel = await models.Channel.findOne({ where: { name }, searchPath: subdomain }, { raw: true })
    
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
          const channel = await models.Channel.create({ name, isPublic, owner: 1 }, { searchPath: subdomain })
          await models.Member.create({ userId: 1, channelId: channel.dataValues.id }, { searchPath: subdomain })

          return {
            success: true,
            channel
          }
        }
      } catch (err) {
        console.log('err: ', err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }
    }),

    addMember: requiresAuth.createResolver(async (parent, { channelId }, { models, subdomain }) => {

      try {
        const members = await models.Member.bulkCreate(members.map(member => ({ userId: member, channelId: channelId })), { searchPath: subdomain })
        console.log('memberAdded', members)
        return {
          success: true,
          members
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

  Channel: {
    users: ({ id }, args, { models, subdomain }) => {
      return models.User.findAll({ 
        include: [
          {
            model: models.Channel,
            where: { id: id }, 
            searchPath: subdomain
          }
        ]
      }, { raw: true })
    }

  },

  GetChannelsUsersCountResponse: {
    usersCount: ({ id }, args, { models, subdomain }) => {
      return models.User.count({ 
        include: [
          {
            model: models.Channel,
            where: { id: id }, 
            searchPath: subdomain
          }
        ]}, { raw: true })
    }

  }       
          
}