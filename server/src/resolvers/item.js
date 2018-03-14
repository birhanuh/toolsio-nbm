export default {
  Query: {
    getItem: (parent, {id}, {models}) => models.Item.findOne({ where: {id} }),
    getAllItems: (parent, args, {models}) => models.Item.findAll()
  },

  Mutation: {
    createItem: async (parent, args, { models }) => {
      try {
        const Item = await models.Item.create(args)
        return Item
      } catch (err) {
        console.log(err)
        return false
      }
    }  
  }             
}