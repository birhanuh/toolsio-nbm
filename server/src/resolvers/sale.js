import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getSale: requiresAuth.createResolver((parent, { id }, { models }) => models.Sale.findOne({ where: { id } }, { raw: true })),
    
    getSales: requiresAuth.createResolver((parent, { offset, limit, order }, { models }) => 
      models.Sale.findAll({ offset, limit, order: [['updated_at', ''+order+'']] }, { raw: true })),

    getSalesWithoutInvoice: requiresAuth.createResolver((parent, args, { models }) => 
      models.sequelize.query('SELECT s.id, s.name, s.deadline, s.status, s.description, s.customer_id, s.user_id FROM sales s LEFT JOIN invoices i ON s.id = i.sale_id WHERE i.sale_id IS NULL', {
        model: models.Sale,
        raw: true,
      })),

    getSalesWithInvoice: requiresAuth.createResolver((parent, args, { models }) => 
      models.sequelize.query('SELECT s.id, s.name, s.deadline, s.status, s.description, s.customer_id, s.user_id FROM sales s INNER JOIN invoices i ON s.id = i.sale_id', {
        model: models.Sale,
        raw: true,
      }))
  },

 Mutation: {
    createSale: requiresAuth.createResolver((parent, args, { models, user }) => 
      models.Sale.create({...args, userId: user.id})
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
        })),

    updateSale: requiresAuth.createResolver((parent, args, { models }) => 
      models.Sale.update(args, { where: {id: args.id}, returning: true, plain: true })
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
        })),

    deleteSale: requiresAuth.createResolver((parent, args, { models }) => 
      models.Sale.destroy({ where: {id: args.id}, force: true })
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

  Sale: {
    items: ({ id }, args, { models } ) => models.Item.findAll({ where: { saleId: id} }),
    
    customer: ({ customerId }, args, { models }) => models.Customer.findOne({ where: {id: customerId} }, { raw: true }),

    user: ({ userId }, args, { models }) => models.User.findOne({ where: {id: userId} }, { raw: true }),

    total: async ({ id }, args, { models }) => {     
      const totalSum = await models.Item.sum('total', {
          where: { saleId: id }
        }) 
     
      return totalSum ? totalSum : 0      
    }
  },

  GetSalesResponse: {
    customer: ({ customerId }, args, { models }) => models.Customer.findOne({ where: {id: customerId} }, { raw: true }),

    user: ({ userId }, args, { models }) => models.User.findOne({ where: {id: userId} }, { raw: true })    
  },

  GetSalesWithoutInvoiceResponse: {
    customer: ({ customer_id }, args, { models }) => models.Customer.findOne({ where: {id: customer_id} }, { raw: true }),

    total: async ({ id }, args, { models }) => {     
      const totalSum = await models.Item.sum('total', {
          where: { saleId: id }
        }) 
     
      return totalSum ? totalSum : 0      
    } 
  },

  GetSalesWithInvoiceResponse: {
    customer: ({ customer_id }, args, { models }) => models.Customer.findOne({ where: {id: customer_id} }, { raw: true }),

    total: async ({ id }, args, { models }) => {     
      const totalSum = await models.Item.sum('total', {
          where: { saleId: id }
        }) 
     
      return totalSum ? totalSum : 0      
    }
  }

}