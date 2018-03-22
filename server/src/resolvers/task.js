import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getTask: (parent, {id}, { models }) => models.Task.findOne({ where: {id} }),
    getTasks: (parent, args, { models }) => models.Task.findAll()
  },

  Mutation: {
    createTask: async (parent, args, { models }) => {
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
    }  
  }         
}