export default {
  
  Query: {
    getMessage: (parent, {id}, {models}) => models.Message.findOne({ where: {id} }),
    getAllMessages: (parent, args, {models}) => models.Message.findAll()
  },

  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
      try {
        await models.Message.create({
          ...args, 
          author: user.id,
          conversation_id: 1
        })
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    }  
  }        
}