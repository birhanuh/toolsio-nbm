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
            where: { id: user.id }
          }
        ], searchPath: subdomain
      }, { raw: true }))

  },

  Mutation: {
    createChannel: requiresAuth.createResolver(async (parent, { name, isPublic }, { models, user, subdomain }) => {
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
          const channelCreated = await models.Channel.create({ name, isPublic, owner: user.id }, { searchPath: subdomain })
 
          await models.Member.create({ userId: user.id, channelId: channelCreated.dataValues.id }, { searchPath: subdomain })

          return {
            success: true,
            channel: channelCreated
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

    addMember: requiresAuth.createResolver(async (parent, {members, channelId }, { models, subdomain }) => {

      try {
        const membersCreated = await models.Member.bulkCreate(members.map(member => ({ userId: member, channelId: channelId })), { searchPath: subdomain })
        
        return {
          success: true,
          members: membersCreated.map(member => member.dataValues.userId)
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
    usersInChannel: ({ id }, args, { models, subdomain }) => {
      return models.User.findAll({ 
        include: [
          {
            model: models.Channel,
            where: { id: id }
          }
        ], searchPath: subdomain
      }, { raw: true })
    },

    usersNotInChannel: ({ id }, args, { models, subdomain }) => {
      return models.sequelize.query("SELECT u.id, u.email FROM users u LEFT JOIN (SELECT u.id, u.email FROM users u INNER JOIN members m ON m.channel_id=:channelId AND u.id = m.user_id) m ON u.id = m.id WHERE m.id IS NULL",
        { replacements: { channelId: id },
        model: models.Channel,
        raw: true,
        searchPath: subdomain
      })
    }

  },

  GetChannelsUsersCountResponse: {
    usersCount: ({ id }, args, { models, subdomain }) => {
      return models.User.count({ 
        include: [
          {
            model: models.Channel,
            where: { id: id }
          }
        ], searchPath: subdomain
      }, { raw: true })
    }

  }       
          
}