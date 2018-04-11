import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getItem: requiresAuth.createResolver((parent, {id}, { models }) => models.Item.findOne({ where: {id} })),
    getItems: requiresAuth.createResolver((parent, args, { models }) => models.Item.findAll())
  },

  Mutation: {
    createItem: requiresAuth.createResolver(async (parent, args, { models }) => {
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
  })            
}