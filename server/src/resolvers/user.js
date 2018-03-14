
import { formatErrors } from '../middlewares/formatErrors'

export default {
  Query: {
    getUser: (parent, {id}, {models}) => models.User.findOne({ where: {id} }),
    getAllUsers: (parent, args, {models}) => models.User.findAll()
  },

  Mutation: {

    createUser: async (parent, { password, ...args }, { models }) => {
      try {

        if (password.length < 5) {

          return {
            success: false,     
            errors: [{ // checks for email format (foo@bar.com) 
              path: 'password',
              message: 'Password needs to be at least 5 characters'
            }]
          } 
        }

        const user = await models.User.create(args)
        return {
          success: true,
          user
        }
      } catch(err) {
        console.log(err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }
    }
  }    
}