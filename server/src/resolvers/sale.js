export default {
  Query: {
    getSale: (parent, {id}, {models}) => models.Sale.findOne({ where: {id} }),
    getAllSales: (parent, args, {models}) => models.Sale.findAll()
  },

  Mutation: {
    createSale: (parent, args, { models }) => models.Sale.create(args)  
  }      
}