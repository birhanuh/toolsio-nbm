export default {
  Query: {
    getTask: (parent, {id}, {models}) => models.Task.findOne({ where: {id} }),
    getAllTasks: (parent, args, {models}) => models.Task.findAll()
  },

  Mutation: {
    createTask: async (parent, args, { models }) => {
      try {
        const Task = await models.Task.create(args)
        return Task
      } catch (err) {
        console.log(err)
        return false
      }
    }  
  }         
}