import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getCustomer: (parent, {id}, {models}) => models.Customer.findOne({ where: {id} }),
    getCustomers: (parent, args, {models}) => models.Customer.findAll()
  },

  Mutation: {
    createCustomer: (parent, args, { models }) => 
      models.Customer.create(args)
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
  }          
}