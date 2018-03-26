import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  
  Query: {
    getInvoice: (parent, {id}, { models }) => models.Invoice.findOne({ where: {id} }, { raw: true }),
    getInvoices: (parent, args, { models }) => models.Invoice.findAll()
  },

  Mutation: {
    createInvoice: async (parent, args, { models, user }) => {
      try {
        const customer = models.Customer.findOne({where: {id: args.customerId} }, { raw: true })
        
        let date = new Date(args.deadline)
        let dataFormated = date.getDate().toString()+(date.getMonth()+1).toString()+date.getFullYear().toString() 
        
        //let referenceNumber = dataFormated+ '-' +(args.projectId || args.saleId).toString()+user.id.toString()
        let referenceNumber = dataFormated+ '-' +(args.projectId || args.saleId).toString()
       
        const invoice = await models.Invoice.create({...args, referenceNumber})

        return {
          success: true,
          invoice: invoice
        }
      } catch (err) {
        console.log(err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }
    },

    updateInvoice: (parent, args, { models }) => {
      return models.Invoice.update(args, { where: {id: args.id}, returning: true, plain: true })
        .then(result => {
  
          return {
            success: true,
            invoice: result[1].dataValues
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

    deleteInvoice: (parent, args, { models }) => {
      return models.Invoice.destroy({ where: {id: args.id}, force: true })
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

  GetInvoicesResponse: {

    customer: ({ customerId }, args, { models }) => {

      return models.Customer.findOne({ where: {id: customerId} }, { raw: true })
    },

    project: ({ projectId }, args, { models }) => {

      return models.Project.findOne({ where: {id: projectId} }, { raw: true })
    },

    sale: ({ saleId }, args, { models }) => {

      return models.Sale.findOne({ where: {id: saleId} }, { raw: true })
    }
  },

  Invoice: {

    customer: ({ customerId }, args, { models }) => {

      return models.Customer.findOne({ where: {id: customerId} }, { raw: true })
    },

    project: ({ projectId }, args, { models }) => {

      return models.Project.findOne({ where: {id: projectId} }, { raw: true })
    },

    sale: ({ saleId }, args, { models }) => {

      return models.Sale.findOne({ where: {id: saleId} }, { raw: true })
    }
  }                
}