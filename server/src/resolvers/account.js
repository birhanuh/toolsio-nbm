
import formatErrors from '../utils/formatErrors'

export default {
  Query: {
    getAccount: (parent, {subdomain}, {models}) => models.Account.findOne({ where: {subdomain} }),
    getAccounts: (parent, args, {models}) => models.Account.findAll()
  },

  Mutation: {
    createAccount: async (parent, args, { models, user }) => {
      try {
        const account = await models.Account.create({...args, owner: user.id})
        return {
          success: true,
          account
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