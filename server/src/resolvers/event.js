import requiresAuth from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {    
    getEvents: requiresAuth.createResolver((parent, args, { models }) => models.Event.findAll()),

    getProjectEvents: requiresAuth.createResolver((parent, args, { models }) => 
      models.Project.findAll({ 
        where: { deadline: {
          [models.sequelize.Op.gt]: new Date()
        }}})
        .then(project => {
            return {
              id: project.id,
              title: project.name,
              description: project.description,
              start: project.deadline,
              end: project.deadline
            }
          })
          .catch(err => {
            console.log('err: ', err)
          })
      ),

    getSaleEvents: requiresAuth.createResolver((parent, args, { models }) => 
      models.Sale.findAll({ 
        where: { deadline: {
          [models.sequelize.Op.gt]: new Date()
        }}})
      )
  },

  Mutation: {
    createEvent: requiresAuth.createResolver((parent, args, { models }) => 
      models.Event.create(args)
        .then(event => {
            return {
              success: true,
              event
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
            event: result[1].dataValues
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