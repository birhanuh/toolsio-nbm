import requiresAuth from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getEvent: requiresAuth.createResolver((parent, {id}, { models }) => models.Event.findOne({ where: {id} })),
    getEvents: requiresAuth.createResolver((parent, args, { models }) => models.Event.findAll({ 
        where: { start: {
          [models.sequelize.Op.gt]: new Date()
        }}}))
  },

  Mutation: {
    createEvent: requiresAuth.createResolver((parent, args, { models }) => 
      models.Event.create(args)
        .then(Event => {
            return {
              success: true,
              Event
            }
          })
          .catch(err => {
            console.log('err: ', err)
            return {
              success: false,
              errors: formatErrors(err, models)
            }
          })),

    updateEvent: requiresAuth.createResolver((parent, args, { models }) => 
      models.Event.update(args, { where: {id: args.id}, returning: true, plain: true })
        .then(result => {
  
          return {
            success: true,
            Event: result[1].dataValues
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })),

    deleteEvent: requiresAuth.createResolver((parent, args, { models }) => 
      models.Event.destroy({ where: {id: args.id}, force: true })
        .then(res => {
          
          return {
            success: (res === 1)
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        }))          
  }          
}