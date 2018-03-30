import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getSale: (parent, {id}, { models }) => models.Sale.findOne({ where: {id} }, { raw: true }),
    getSales: (parent, args, { models }) => models.Sale.findAll()
  },

 Mutation: {
    createSale: (parent, args, { models }) => {
      return models.Sale.create(args)
        .then(sale => {
          return {
            success: true,
            sale
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

    updateSale: (parent, args, { models }) => {
      return models.Sale.update(args, { where: {id: args.id}, returning: true, plain: true })
        .then(result => {
  
          return {
            success: true,
            sale: result[1].dataValues
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

    deleteSale: (parent, args, { models }) => {
      return models.Sale.destroy({ where: {id: args.id}, force: true })
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
    }         
  
  },

  Sale: {
    items: ({ id }, args, { models } ) => { 

      return models.Item.findAll({ saleId: id})
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