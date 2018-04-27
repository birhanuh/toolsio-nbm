import { requiresAuth } from '../middlewares/authentication'
import { formatErrors } from '../utils/formatErrors'

export default {
  Query: {
    getItem: requiresAuth.createResolver((parent, {id}, { models }) => models.Item.findOne({ where: {id} })),
    getItems: requiresAuth.createResolver((parent, args, { models }) => models.Item.findAll())
  },

  Mutation: {
    createItem: requiresAuth.createResolver((parent, args, { models }) => 
      models.Item.create(args)
        .then(project => {
            return {
              success: true,
              project
            }
          })
          .catch(err => {
            console.log('err: ', err)
            return {
              success: false,
              errors: formatErrors(err, models)
            }
          })),

    updateItem: requiresAuth.createResolver((parent, args, { models }) => 
      models.Item.update(args, { where: {id: args.id}, returning: true, plain: true })
        .then(result => {
  
          return {
            success: true,
            item: result[1].dataValues
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })),

    deleteItem: requiresAuth.createResolver((parent, args, { models }) => 
      models.Item.destroy({ where: {id: args.id}, force: true })
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
  }          
}