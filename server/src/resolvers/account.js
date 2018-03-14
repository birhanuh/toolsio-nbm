
import formatErrors from '../middlewares/formatErrors'

export default {
  Query: {
    getAccount: (parent, {id}, {models}) => models.Account.findOne({ where: {id} }),
    getAllAccounts: (parent, args, {models}) => models.Account.findAll()
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