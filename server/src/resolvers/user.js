
import { formatErrors } from '../utils/formatErrors'
import { loginUserWithToken } from '../utils/authentication'

export default {
  Query: {
    getUser: (parent, {id}, {models}) => models.User.findOne({ where: {id} }),
    getAllUsers: (parent, args, {models}) => models.User.findAll()
  },

  Mutation: {
    loginUser: (parent, { email, password }, { models, SECRET, SECRET2 }) => loginUserWithToken(email, password, models, SECRET, SECRET2),
    registerUser: async (parent, args, { models }) => {
      try {

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