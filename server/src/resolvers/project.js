import Sequelize from "sequelize";
import requiresAuth from "../middlewares/authentication";
import { formatErrors } from "../utils/formatErrors";

export default {
  Query: {
    getProject: requiresAuth.createResolver(
      (_, { id }, { models, subdomain }) =>
        models.Project.findOne({ where: { id }, searchPath: subdomain })
    ),

    getProjects: requiresAuth.createResolver(
      (_, { offset, limit, order, name }, { models, subdomain }) =>
        models.Project.findAll(
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
    ),

    getProjectsWithoutInvoice: requiresAuth.createResolver(
      (_, { name }, { models, subdomain }) =>
        models.sequelize.query(
          "SELECT p.id, p.name, p.deadline, p.status, p.progress, p.description, p.customer_id, p.user_id, c.id AS customer_id, c.name AS customer_name FROM projects p LEFT JOIN invoices i ON p.id=i.project_id JOIN customers c ON p.customer_id = c.id WHERE i.project_id IS NULL AND p.status='finished' AND p.name ILIKE :projectName",
          {
            replacements: { projectName: "%" + name + "%" },
            model: models.Project,
            raw: true,
            searchPath: subdomain
          }
        )
    ),

    getProjectsWithInvoice: requiresAuth.createResolver(
      (_, __, { models, subdomain }) =>
        models.sequelize.query(
          "SELECT p.id, p.name, p.deadline, p.status, p.progress, p.description, p.customer_id, p.user_id FROM projects p INNER JOIN invoices i ON p.id = i.project_id",
          {
            model: models.Project,
            raw: true,
            searchPath: subdomain
          }
        )
    )
  },

  Mutation: {
    createProject: requiresAuth.createResolver(
      (_, args, { models, subdomain, user }) =>
        models.Project.create(
          { ...args, userId: user.id },
          { searchPath: subdomain }
        )
          .then(project => {
            return {
              success: true,
              project
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

    updateProject: requiresAuth.createResolver(
      (_, args, { models, subdomain }) =>
        models.Project.update(args, {
          where: { id: args.id },
          returning: true,
          plain: true,
          searchPath: subdomain
        })
          .then(result => {
            return {
              success: true,
              project: result[1].dataValues
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

    deleteProject: requiresAuth.createResolver(
      (_, args, { models, subdomain }) =>
        models.Project.destroy({
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

  Project: {
    tasks: ({ id }, __, { models, subdomain }) =>
      models.Task.findAll({ where: { projectId: id }, searchPath: subdomain }),

    customer: ({ customerId }, __, { models, subdomain }) =>
      models.Customer.findOne(
        { where: { id: customerId }, searchPath: subdomain },
        { raw: true }
      ),

    user: ({ userId }, __, { models, subdomain }) =>
      models.User.findOne(
        { where: { id: userId }, searchPath: subdomain },
        { raw: true }
      ),

    total: async ({ id }, __, { models, subdomain }) => {
      const totalSum = await models.Task.sum("total", {
        where: { projectId: id },
        searchPath: subdomain
      });

      return totalSum ? totalSum : 0;
    }
  },

  GetProjectsResponse: {
    customer: ({ customerId }, __, { customerLoader }) =>
      customerLoader.load(customerId),

    user: ({ userId }, __, { userLoader }) => userLoader.load(userId)
  },

  GetProjectsWithoutInvoiceResponse: {
    total: async ({ id }, __, { models, subdomain }) => {
      const totalSum = await models.Task.sum("total", {
        where: { projectId: id },
        searchPath: subdomain
      });

      return totalSum ? totalSum : 0;
    }
  },

  GetProjectsWithInvoiceResponse: {
    customer: ({ customer_id }, __, { models, subdomain }) =>
      models.Customer.findOne(
        { where: { id: customer_id }, searchPath: subdomain },
        { raw: true }
      ),

    total: async ({ id }, __, { models, subdomain }) => {
      const totalSum = await models.Task.sum("total", {
        where: { projectId: id },
        searchPath: subdomain
      });

      return totalSum ? totalSum : 0;
    }
  }
};
