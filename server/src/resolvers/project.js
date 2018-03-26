import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {

  Query: {
    getProject: (parent, {id}, { models }) => {
      console.log('id ', id)
      return models.Project.findOne({ where: { id } }, 
        {
          include: [
            {
              model: models.Task,
              where: { projectId: id }
            }
          ]
        }, { raw: true })

    },

    // getProject: (parent, {id}, { models }) => {
    //   return requiresAuth.createResolver(models.Project.findOne({ where: { id } }, 
    //     {
    //       include: [
    //         {
    //           model: models.Task,
    //           where: { projectId: id }
    //         }
    //       ]
    //     }, { raw: true }))
    // },
    getProjects: (parent, args, { models }) => models.Project.findAll()
  },

  Mutation: {
    createProject: (parent, args, { models }) => {
      return models.Project.create(args)
        .then(project => {
          return {
            success: true,
            project
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })
    },

    updateProject: (parent, args, { models }) => {
      return models.Project.update(args, { where: {id: args.id}, returning: true, plain: true })
        .then(result => {
  
          return {
            success: true,
            project: result[1].dataValues
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })
    },

    deleteProject: (parent, args, { models }) => {
      return models.Project.destroy({ where: {id: args.id}, force: true })
        .then(res => {
          
          return {
            success: (res === 1)
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
  },

  Project: {
    tasks: ({ id }, args, { models } ) => { 

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

