import requiresAuth from "../middlewares/authentication";
import { formatErrors } from "../utils/formatErrors";

export default {
  Query: {
    getItem: requiresAuth.createResolver(
      (parent, { id }, { models, subdomain }) =>
        models.Item.findOne({ where: { id }, searchPath: subdomain })
    ),

    getItems: requiresAuth.createResolver(
      (parent, args, { models, subdomain }) =>
        models.Item.findAll({ searchPath: subdomain })
    )
  },

  Mutation: {
    createItem: requiresAuth.createResolver(
      (parent, args, { models, subdomain }) =>
        models.Item.create(args, { searchPath: subdomain })
          .then(item => {
            return {
              success: true,
              item
            };
          })
          .catch(err => {
            console.log("err: ", err);
            return {
              success: false,
              errors: formatErrors(err)
            };
          })
    ),

    updateItem: requiresAuth.createResolver(
      (parent, args, { models, subdomain }) =>
        models.Item.update(args, {
          where: { id: args.id },
          returning: true,
          plain: true,
          searchPath: subdomain
        })
          .then(result => {
            return {
              success: true,
              item: result[1].dataValues
            };
          })
          .catch(err => {
            console.log("err: ", err);
            return {
              success: false,
              errors: formatErrors(err)
            };
          })
    ),

    deleteItem: requiresAuth.createResolver(
      (parent, args, { models, subdomain }) =>
        models.Item.destroy({
          where: { id: args.id },
          force: true,
          searchPath: subdomain
        })
          .then(res => {
            return {
              success: res === 1
            };
          })
          .catch(err => {
            console.log("err: ", err);
            return {
              success: false,
              errors: formatErrors(err)
            };
          })
    )
  }
};
