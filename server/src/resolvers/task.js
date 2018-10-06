import requiresAuth from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getTask: requiresAuth.createResolver((parent, { id }, { models, subdomain }) => models.Task.findOne({ where: { id }, searchPath: subdomain })),
    
    getTasks: requiresAuth.createResolver((parent, args, { models, subdomain }) => models.Task.findAll({ searchPath: subdomain }))
  },

  Mutation: {
    createTask: requiresAuth.createResolver((parent, args, { models, subdomain }) => 
      models.Task.create(args, { searchPath: subdomain })
        .then(task => {  
          return {
            success: true,
            task
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })),

    updateTask: requiresAuth.createResolver((parent, args, { models, subdomain }) => 
      models.Task.update(args, { where: {id: args.id}, returning: true, plain: true, searchPath: subdomain })
        .then(result => {  
          return {
            success: true,
            task: result[1].dataValues
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })),

    deleteTask: requiresAuth.createResolver((parent, args, { models, subdomain }) =>
      models.Task.destroy({ where: {id: args.id}, force: true, searchPath: subdomain })
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
        }))          
  }       
}