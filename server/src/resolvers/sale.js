import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getSale: requiresAuth.createResolver((parent, { id }, { models }) => models.Sale.findOne({ where: { id } }, { raw: true })),
    
    getSales: requiresAuth.createResolver((parent, args, { models }) => models.Sale.findAll()),

    getSalesWithoutInvoice: requiresAuth.createResolver((parent, args, { models }) => 
      models.sequelize.query('select p.id, p.name, p.deadline, p.status, p.description, p.total, p.customer_id, p.user_id from sales as p join invoices as i on (p.id != i.sale_id)', {
        model: models.Sale,
        raw: true,
      }))
  },

 Mutation: {
    createSale: requiresAuth.createResolver((parent, args, { models, user }) => {
      return models.Sale.create({...args, userId: user.id})
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
    }),

    updateSale: requiresAuth.createResolver((parent, args, { models }) => {
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
    }),

    deleteSale: requiresAuth.createResolver((parent, args, { models }) => {
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
    })         
  
  },

  Sale: {
    items: ({ id }, args, { models } ) => models.Item.findAll({ where: { saleId: id} }),
    
    customer: ({ customerId }, args, { models }) => models.Customer.findOne({ where: {id: customerId} }, { raw: true }),

    user: ({ userId }, args, { models }) => models.User.findOne({ where: {id: userId} }, { raw: true })
  },

  GetSalesResponse: {
    customer: ({ customerId }, args, { models }) => models.Customer.findOne({ where: {id: customerId} }, { raw: true }),

    user: ({ userId }, args, { models }) => models.User.findOne({ where: {id: userId} }, { raw: true })    
  },

  GetSalesWithoutInvoiceResponse: {
    customer: ({ customer_id }, args, { models }) => models.Customer.findOne({ where: {id: customer_id} }, { raw: true })  
  }

}