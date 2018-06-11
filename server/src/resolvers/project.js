import requiresAuth from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {

  Query: {
    getProject: requiresAuth.createResolver((parent, { id }, { models }) =>  models.Project.findOne({ where: { id } })),
    
    getProjects: requiresAuth.createResolver((parent, { offset, limit, order, name }, { models }) => 
      models.Project.findAll({ where: {
        name: {
          [models.sequelize.Op.iLike]: '%'+name+'%'
        }
      }, offset, limit, order: [['updated_at', ''+order+'']] }, { raw: true })),

    getProjectsWithoutInvoice: requiresAuth.createResolver((parent, { name }, { models }) => 
      models.sequelize.query("SELECT p.id, p.name, p.deadline, p.status, p.progress, p.description, p.customer_id, p.user_id, c.id AS customer_id, c.name AS customer_name FROM projects p LEFT JOIN invoices i ON p.id=i.project_id JOIN customers c ON p.customer_id = c.id WHERE i.project_id IS NULL AND p.name ILIKE :projectName", 
        { replacements: { projectName: '%'+name+'%' },
          model: models.Project,
          raw: true
        })),

    getProjectsWithInvoice: requiresAuth.createResolver((parent, args, { models }) => 
      models.sequelize.query('SELECT p.id, p.name, p.deadline, p.status, p.progress, p.description, p.customer_id, p.user_id FROM projects p INNER JOIN invoices i ON p.id = i.project_id', { 
        model: models.Project,
        raw: true,
      }))
  },

  Mutation: {
    createProject: requiresAuth.createResolver((parent, args, { models, user }) => 
      models.Project.create({...args, userId: user.id})
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
        })),

    updateProject: requiresAuth.createResolver((parent, args, { models }) => 
      models.Project.update(args, { where: {id: args.id}, returning: true, plain: true })
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
        })),

    deleteProject: requiresAuth.createResolver((parent, args, { models }) => 
      models.Project.destroy({ where: {id: args.id}, force: true })
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
  },

  Project: {
    tasks: ({ id }, args, { models } ) => models.Task.findAll({ where: { projectId: id} }),

    customer: ({ customerId }, args, { models }) => models.Customer.findOne({ where: {id: customerId} }, { raw: true }),

    user: ({ userId }, args, { models }) => models.User.findOne({ where: {id: userId} }, { raw: true }),

    total: async ({ id }, args, { models }) => {     
      const totalSum = await models.Task.sum('total', {
          where: { projectId: id }
        }) 
     
      return totalSum ? totalSum : 0      
    }
  },

  GetProjectsResponse: {
    customer: ({ customerId }, args, { customerLoader }) => customerLoader.load(customerId),

    user: ({ userId }, args, { userLoader }) => userLoader.load(userId)
  },

  GetProjectsWithoutInvoiceResponse: {
    total: async ({ id }, args, { models }) => {     
      const totalSum = await models.Task.sum('total', {
          where: { projectId: id }
        }) 
     
      return totalSum ? totalSum : 0      
    }
  },

  GetProjectsWithInvoiceResponse: {
    customer: ({ customer_id }, args, { models }) => models.Customer.findOne({ where: {id: customer_id} }, { raw: true }),

    total: async ({ id }, args, { models }) => {     
      const totalSum = await models.Task.sum('total', {
          where: { projectId: id }
        }) 
     
      return totalSum ? totalSum : 0      
    }
  }
}

