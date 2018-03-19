import { requiresAuth } from '../middlewares/authentication'

export default {

  Query: {
    getProject: requiresAuth.createResolver((parent, {id}, { models }) => models.Project.findOne({ where: {id} })),
    getProjects: (parent, args, { models }) => models.Project.findAll()
  },

  Mutation: {
    createProject: (parent, args, { models }) => 
      models.Project.create(args)
        .then(project => {
          return {
            success: true,
            project: project
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })
  }      
}

