export default {
  Query: {
    getAccount: (parent, {id}, {models}) => models.Account.findOne({ where: {id} }),
    getAllAccounts: (parent, args, {models}) => models.Account.findAll()
  },

  Mutation: {
    createAccount: async (parent, args, { models, user }) => {
      try {
        await models.Account.create({...args, owner: user.id})
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    }  
  }    
}