import requiresAuth from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getChannel: requiresAuth.createResolver((parent, { id }, { models }) => models.Channel.findOne({ where: { id } })),

    getChannelsUsersCount:  requiresAuth.createResolver((parent, args, { models, user }) => 
      models.Channel.findAll({
        include: [
          {
            model: models.User,
            where: { id: user.id }
          }
        ]
      }, { raw: true }))

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
          await models.Member.create({ userId: 1, channelId: channel.dataValues.id })

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

    addMember: requiresAuth.createResolver(async (parent, { members, channelId }, { models, user }) => {

      try {
        const members = await models.Member.bulkCreate(members.map(member => ({ userId: member, channelId: channelId })))
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

  GetChannelsUsersCountResponse: {
    usersCount: ({ id }, args, { models }) => {
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