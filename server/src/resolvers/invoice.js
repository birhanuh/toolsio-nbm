export default {
  
  Query: {
    getInvoice: (parent, {id}, {models}) => models.Invoice.findOne({ where: {id} }),
    getAllInvoices: (parent, args, {models}) => models.Invoice.findAll()
  },

  Mutation: {
    createInvoice: async (parent, args, { models }) => {
      try {
        const Invoice = await models.Invoice.create(args)
        return Invoice
      } catch (err) {
        console.log(err)
        return false
      }
    }  
  }          
}