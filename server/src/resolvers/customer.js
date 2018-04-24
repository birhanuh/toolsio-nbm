import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getCustomer: requiresAuth.createResolver((parent, { id }, { models }) => models.Customer.findOne({ where: { id } }, { raw: true })),

    getCustomers: requiresAuth.createResolver((parent, args, { models }) => models.Customer.findAll())
  },

  Mutation: {
    createCustomer: requiresAuth.createResolver((parent, args, { models, user }) => {
      return models.Customer.create({...args, userId: user.id})
        .then(customer => {
          return {
            success: true,
            customer: customer
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

    updateCustomer: requiresAuth.createResolver((parent, args, { models }) => {
      return models.Customer.update(args, { where: {id: args.id}, returning: true, plain: true })
        .then(result => {
          return {
            success: true,
            customer: result[1].dataValues
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

    deleteCustomer: requiresAuth.createResolver((parent, args, { models }) => {
      return models.Customer.destroy({ where: {id: args.id}, force: true })
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

  },

  Customer: {
    projects: ({ id }, args, { models } ) => models.Project.findAll({ where: { customerId: id} }),

    sales: ({ id }, args, { models } ) => models.Sale.findAll({ where: { customerId: id} }),

    invoices: ({ id }, args, { models } ) => models.Invoice.findAll({ where: { customerId: id} }),

    user: ({ userId }, args, { models }) => models.User.findOne({ where: {id: userId} }, { raw: true })
    
  }        
}

