import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {

  Query: {
    getProject: (parent, {id}, { models }) => requiresAuth.createResolver(models.Project.findOne({ where: {id} }, { raw: true })),
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
  ,

  Project: {
    tasks: ({ id }, args, models) => { 

      return models.Task.findAll({ projectId: id})
    },

    customer: ({ customerId }, args, { models }) => {

      return models.Customer.findOne({ where: {id: customerId} }, { raw: true })
    }
  },

  GetProjectsResponse: {

    customer: ({ customerId }, args, { models }) => {

      return models.Customer.findOne({ where: {id: customerId} }, { raw: true })
    }
  }

}

