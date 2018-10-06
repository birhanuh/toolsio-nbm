import requiresAuth from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getSale: requiresAuth.createResolver((parent, { id }, { models, subdomain }) => models.Sale.findOne({ where: { id }, searchPath: subdomain }, { raw: true })),
    
    getSales: requiresAuth.createResolver((parent, { offset, limit, order, name }, { models, subdomain }) => 
      models.Sale.findAll({ where: {
        name: {
          [models.sequelize.Op.iLike]: '%'+name+'%'
        }
      }, offset, limit, order: [['updated_at', ''+order+'']], searchPath: subdomain }, { raw: true })),

    getSalesWithoutInvoice: requiresAuth.createResolver((parent, { name }, { models, subdomain }) => 
      models.sequelize.query('SELECT s.id, s.name, s.deadline, s.status, s.description, s.customer_id, s.user_id, c.id AS customer_id, c.name AS customer_name FROM sales s LEFT JOIN invoices i ON s.id = i.sale_id JOIN customers c ON s.customer_id=c.id WHERE i.sale_id IS NULL AND s.name ILIKE :saleName', 
        {  replacements: { saleName: '%'+name+'%' },
          model: models.Sale,
          raw: true,
          searchPath: subdomain
        })),

    getSalesWithInvoice: requiresAuth.createResolver((parent, args, { models, subdomain }) => 
      models.sequelize.query('SELECT s.id, s.name, s.deadline, s.status, s.description, s.customer_id, s.user_id FROM sales s INNER JOIN invoices i ON s.id = i.sale_id', {
        model: models.Sale,
        raw: true,
        searchPath: subdomain
      }))
  },

 Mutation: {
    createSale: requiresAuth.createResolver((parent, args, { models, user, subdomain }) => 
      models.Sale.schema(subdomain).create({...args, userId: user.id}, { searchPath: subdomain })
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

    updateSale: requiresAuth.createResolver((parent, args, { models, subdomain }) => 
      models.Sale.schema(subdomain).update(args, { where: {id: args.id}, returning: true, plain: true, searchPath: subdomain })
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

    deleteSale: requiresAuth.createResolver((parent, args, { models, subdomain }) => 
      models.Sale.schema(subdomain).destroy({ where: {id: args.id}, force: true, searchPath: subdomain })
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
    items: ({ id }, args, { models, subdomain } ) => models.Item.findAll({ where: { saleId: id}, searchPath: subdomain }),
    
    customer: ({ customerId }, args, { models, subdomain }) => models.Customer.findOne({ where: {id: customerId}, searchPath: subdomain }, { raw: true }),

    user: ({ userId }, args, { models, subdomain }) => models.User.findOne({ where: {id: userId}, searchPath: subdomain }, { raw: true }),

    total: async ({ id }, args, { models, subdomain }) => {     
      const totalSum = await models.Item.sum('total', {
          where: { saleId: id }, searchPath: subdomain
        }) 
     
      return totalSum ? totalSum : 0      
    }
  },

  GetSalesResponse: {
    customer: ({ customerId }, args, { customerLoader }) => customerLoader.load(customerId),

    user: ({ userId }, args, { userLoader }) => userLoader.load(userId)
  },

  GetSalesWithoutInvoiceResponse: {
    total: async ({ id }, args, { models, subdomain }) => {     
      const totalSum = await models.Item.sum('total', {
          where: { saleId: id }, searchPath: subdomain
        }) 
     
      return totalSum ? totalSum : 0      
    } 
  },

  GetSalesWithInvoiceResponse: {
    customer: ({ customer_id }, args, { models, subdomain }) => models.Customer.findOne({ where: {id: customer_id}, searchPath: subdomain }, { raw: true }),

    total: async ({ id }, args, { models, subdomain }) => {     
      const totalSum = await models.Item.sum('total', {
          where: { saleId: id }, searchPath: subdomain
        }) 
     
      return totalSum ? totalSum : 0      
    }
  }

}