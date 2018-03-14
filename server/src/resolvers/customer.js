export default {
  Query: {
    getCustomer: (parent, {id}, {models}) => models.Customer.findOne({ where: {id} }),
    getAllCustomers: (parent, args, {models}) => models.Customer.findAll()
  },

  Mutation: {
    createCustomer: (parent, args, { models }) => models.Customer.create(args)  
  }          
}