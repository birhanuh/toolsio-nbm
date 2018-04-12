import { requiresAuth } from '../middlewares/authentication'
import formatErrors from '../utils/formatErrors'

export default {
  Query: {
    getAccount: requiresAuth.createResolver((parent, {subdomain}, {models}) => models.Account.findOne({ where: {subdomain} }, { raw: true })),
    getAccounts: requiresAuth.createResolver((parent, args, {models}) => models.Account.findAll())
  },

  Mutation: {
    createAccount: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const account = await models.Account.create({...args, owner: user.id})
        return {
          success: true,
          account
        }
      } catch (err) {
        console.log(err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }
      }
    }),

    updateAccount: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      return models.Account.update(args, { where: {subdomain: args.subdomain}, returning: true, plain: true })
        .then(result => {
          return {
            success: true,
            account: result[1].dataValues
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

    deleteAccount: requiresAuth.createResolver((parent, args, { models }) => {
      return models.Account.destroy({ where: {subdomain: args.subdomain}, force: true })
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
  }    
}