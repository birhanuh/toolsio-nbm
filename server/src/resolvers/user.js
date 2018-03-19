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

      const { firstName, lastName, email, password } = args
      const { subdomain, industry } = args

      try {

        const userBuild = await models.User.build({ firstName, lastName, email, password })
        const accountBuild = await models.Account.build({ subdomain, industry })

        if (!!userBuild && !!accountBuild) {
          const user = await userBuild.save()
          const account = await accountBuild.save()

          return {
            success: true,
            user,
            account
          }
        } else {
          console.log("errors ", userBuild.errors)
          return {
            success: false,
            errors: formatErrors(userBuild || accountBuild, models)
          }
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