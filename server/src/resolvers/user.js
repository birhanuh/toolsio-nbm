import { formatErrors } from '../utils/formatErrors'
import { loginUserWithToken } from '../utils/authentication'

export default {
  Query: {
    getUser: (parent, {id}, {models}) => models.User.findOne({ where: {id} }, { raw: true }),
    getAllUsers: (parent, args, {models}) => models.User.findAll()
  },

  Mutation: {
    loginUser: (parent, { email, password }, { models, SECRET, SECRET2 }) => loginUserWithToken(email, password, models, SECRET, SECRET2),
    registerUser: async (parent, args, { models }) => {

      const { firstName, lastName, email, password } = args
      const { subdomain, industry } = args

      try {
        const response = await models.squelize.transaction(async () => {
          const account = await models.Account.findOne({ where: {subdomain} }, { raw: true })
          const user = await  models.User.create({ firstName, lastName, email, password })

          return user
        })
        return {
          success: true,
          response,
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