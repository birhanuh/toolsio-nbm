import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getItem: (parent, {id}, { models }) => models.Item.findOne({ where: {id} }),
    getItems: (parent, args, { models }) => models.Item.findAll()
  },

  Mutation: {
    createItem: async (parent, args, { models }) => {
      try {
        const item = await models.Item.create(args)
        
        return {
          success: true,
          item
        }
      } catch (err) {
        console.log(err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }
    }  
  }             
}