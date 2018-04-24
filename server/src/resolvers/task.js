import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getTask: requiresAuth.createResolver((parent, { id }, { models }) => models.Task.findOne({ where: { id } })),
    getTasks: requiresAuth.createResolver((parent, args, { models }) => models.Task.findAll())
  },

  Mutation: {
    createTask: requiresAuth.createResolver(async (parent, args, { models }) => {
      try {
        const response = await models.sequelize.transaction(async (transaction) => {

          const task = await models.Task.create(args, { transaction })
          await models.Project.update({ total: models.sequelize.literal('total +' +args.price) }, { where: {id: args.projectId} }, { transaction })

          return task
        })
        
        return {
          success: true,
          task: response.task
        }
      } catch (err) {
        console.log('err: ', err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }
    }),

    updateTask: requiresAuth.createResolver((parent, args, { models }) => {

      return models.Task.update(args, { where: {id: args.id}, returning: true, plain: true })
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
        })
    }),

    deleteTask: requiresAuth.createResolver((parent, args, { models }) => {
      return models.Task.destroy({ where: {id: args.id}, force: true })
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
    })          
  }       
}