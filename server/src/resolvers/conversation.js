export default {
  Query: {
    getConversation: (parent, { id }, { models }) => models.Conversation.findOne({ where: { id } }),
    getConversations: (parent, args, { models }) => models.Conversation.findAll()
  },

  Mutation: {
    createConversation: (parent, args, { models }) => models.Conversation.create(args)  
  }          
}