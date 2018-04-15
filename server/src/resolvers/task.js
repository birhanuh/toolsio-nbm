import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getTask: requiresAuth.createResolver((parent, {id}, { models }) => models.Task.findOne({ where: {id} })),
    getTasks: requiresAuth.createResolver((parent, args, { models }) => models.Task.findAll())
  },

  Mutation: {
    createTask: requiresAuth.createResolver(async (parent, args, { models }) => {
      try {
        const task = await models.Task.create(args)
        
        return {
          success: true,
          task
        }
      } catch (err) {
        console.log('err: ', err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }
    }) 
  }       
}