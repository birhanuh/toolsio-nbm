export default {
  Query: {
    getProject: (parent, {id}, {models}) => models.Project.findOne({ where: {id} }),
    getAllProjects: (parent, args, {models}) => models.Project.findAll()
  },

  Mutation: {
    createProject: (parent, args, { models }) => models.Project.create(args)  
  }      
}

