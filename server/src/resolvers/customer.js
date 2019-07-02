import Sequelize from "sequelize";
import requiresAuth from "../middlewares/authentication";
import { formatErrors } from "../utils/formatErrors";

export default {
  Query: {
    getCustomer: requiresAuth.createResolver(
      (_, { id }, { models, subdomain }) =>
        models.Customer.findOne(
          { where: { id }, searchPath: subdomain },
          { raw: true }
        )
    ),

    getCustomers: requiresAuth.createResolver(
      (_, { offset, limit, order, name }, { models, subdomain }) =>
        models.Customer.findAndCountAll(
          {
            where: {
              name: {
                [Sequelize.Op.iLike]: "%" + name + "%"
              }
            },
            offset,
            limit,
            order: [["updated_at", "" + order + ""]],
            searchPath: subdomain
          },
          { raw: true }
        )
          .then(result => {
            return {
              count: result.count,
              customers: result.rows
            };
          })
          .catch(err => {
            console.log("err: ", err);
            return {
              count: 0,
              customers: []
            };
          })
    )
  },

  Mutation: {
    createCustomer: requiresAuth.createResolver(
      (_, args, { models, subdomain, user }) =>
        models.Customer.create(
          { ...args, userId: user.id },
          { searchPath: subdomain }
        )
          .then(customer => {
            return {
              success: true,
              customer: customer
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

    updateCustomer: requiresAuth.createResolver(
      (_, args, { models, subdomain }) =>
        models.Customer.update(args, {
          where: { id: args.id },
          returning: true,
          plain: true,
          searchPath: subdomain
        })
          .then(result => {
            return {
              success: true,
              customer: result[1].dataValues
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

    deleteCustomer: requiresAuth.createResolver(
      (_, args, { models, subdomain }) =>
        models.Customer.destroy({
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
  },

  Customer: {
    projects: ({ id }, __, { models, subdomain }) =>
      models.Project.findAll({
        where: { customerId: id },
        searchPath: subdomain
      }),

    sales: ({ id }, __, { models, subdomain }) =>
      models.Sale.findAll({ where: { customerId: id }, searchPath: subdomain }),

    invoices: ({ id }, __, { models, subdomain }) =>
      models.Invoice.findAll({
        where: { customerId: id },
        searchPath: subdomain
      }),

    user: ({ userId }, args, { models, subdomain }) =>
      models.User.findOne(
        { where: { id: userId }, searchPath: subdomain },
        { raw: true }
      )
  }
};
