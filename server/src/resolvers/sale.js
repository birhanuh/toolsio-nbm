export default {
  Query: {
    getSale: (parent, {id}, {models}) => models.Sale.findOne({ where: {id} }, { raw: true }),
    getAllSales: (parent, args, {models}) => models.Sale.findAll()
  },

 Mutation: {
    createSale: (parent, args, { models }) => 
      models.Sale.create(args)
        .then(sale => {
          return {
            success: true,
            sale: sale
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
  ,

  Sale: {
    items: ({ id }, args, models) => { 

      return models.Task.findAll({ saleId: id})
    },
    
    customer: ({ customerId }, args, { models }) => {

      return models.Customer.findOne({ where: {id: customerId} }, { raw: true })
    }
  },

  GetSalesResponse: {

    customer: ({ customerId }, args, { models }) => {

      return models.Customer.findOne({ where: {id: customerId} }, { raw: true })
    }
  }

}