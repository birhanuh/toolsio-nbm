import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getCustomer: (parent, {id}, {models}) => models.Customer.findOne({ where: {id} }, { raw: true }),
    getCustomers: (parent, args, {models}) => models.Customer.findAll()
  },

  Mutation: {
    createCustomer: (parent, args, { models }) => {
      return models.Customer.create(args)
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
    },

    updateCustomer: (parent, args, { models }) => {
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
    }

  }          
}