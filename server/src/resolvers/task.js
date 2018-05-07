import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getTask: requiresAuth.createResolver((parent, { id }, { models }) => models.Task.findOne({ where: { id } })),
    getTasks: requiresAuth.createResolver((parent, args, { models }) => models.Task.findAll())
  },

  Mutation: {
    createTask: requiresAuth.createResolver((parent, args, { models }) => 
      models.Task.create(args)
        .then(task => {  
          return {
            success: true,
            project: task
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })),

    updateTask: requiresAuth.createResolver((parent, args, { models }) => 
      models.Task.update(args, { where: {id: args.id}, returning: true, plain: true })
        .then(result => {  
          return {
            success: true,
            project: result[1].dataValues
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })),

    deleteTask: requiresAuth.createResolver((parent, args, { models }) =>
      models.Task.destroy({ where: {id: args.id}, force: true })
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