import requiresAuth from "../middlewares/authentication";
import { formatErrors } from "../utils/formatErrors";

export default {
  Query: {
    getInvoice: requiresAuth.createResolver(
      (parent, { id }, { models, subdomain }) =>
        models.Invoice.findOne(
          { where: { id }, searchPath: subdomain },
          { raw: true }
        )
    ),

    getInvoices: requiresAuth.createResolver(
      (parent, { offset, limit, order, search }, { models, subdomain }) => {
        const options = {
          include: [],
          where: {},
          offset,
          limit,
          order: [["updated_at", "" + order + ""]],
          searchPath: subdomain
        };

        if (/^\d/.test(search)) {
          options.where = {
            referenceNumber: {
              [models.sequelize.Op.iLike]: "%" + search + "%"
            }
          };
        } else if (/[a-zA-Z]/.test(search)) {
          options.include = [
            {
              model: models.Customer,
              where: {
                name: {
                  [models.sequelize.Op.iLike]: "%" + search + "%"
                }
              }
            }
          ];
        }

        return models.Invoice.findAndCountAll(options, { raw: true })
          .then(result => {
            return {
              count: result.count,
              invoices: result.rows
            };
          })
          .catch(err => {
            console.log("err: ", err);
            return {
              count: 0,
              invoices: []
            };
          });
      }
    )
  },

  Mutation: {
    createInvoice: requiresAuth.createResolver(
      async (parent, args, { models, subdomain, user }) => {
        try {
          let date = new Date(args.deadline);
          let dataFormated =
            date.getDate().toString() +
            (date.getMonth() + 1).toString() +
            date.getFullYear().toString();

          let referenceNumber =
            dataFormated + "-" + (args.projectId || args.saleId).toString();

          const response = await models.sequelize.transaction(
            async transaction => {
              const invoice = await models.Invoice.create(
                { ...args, referenceNumber, userId: user.id },
                { searchPath: subdomain, transaction }
              );

              if (args.projectId) {
                models.Project.update(
                  { isInvoiced: true },
                  { where: { id: args.projectId } },
                  { searchPath: subdomain, transaction }
                );
              }

              if (args.saleId) {
                models.Sale.update(
                  { isInvoiced: true },
                  { where: { id: args.saleId } },
                  { searchPath: subdomain, transaction }
                );
              }

              return { invoice };
            }
          );

          return {
            success: true,
            invoice: response.invoice
          };
        } catch (err) {
          console.log("err: ", err);
          return {
            success: false,
            errors: formatErrors(err, models)
          };
        }
      }
    ),

    updateInvoice: requiresAuth.createResolver(
      (parent, args, { models, subdomain }) =>
        models.Invoice.update(args, {
          where: { id: args.id },
          returning: true,
          plain: true,
          searchPath: subdomain
        })
          .then(result => {
            return {
              success: true,
              invoice: result[1].dataValues
            };
          })
          .catch(err => {
            console.log("err: ", err);
            return {
              success: false,
              errors: formatErrors(err, models)
            };
          })
    ),

    deleteInvoice: requiresAuth.createResolver(
      (parent, args, { models, subdomain }) =>
        models.Invoice.destroy({
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
              errors: formatErrors(err, models)
            };
          })
    )
  },

  GetInvoicesResponseRows: {
    customer: ({ customerId }, args, { customerLoader }) =>
      customerLoader.load(customerId),

    project: ({ projectId }, args, { projectLoader }) =>
      projectId && projectLoader.load(projectId),

    sale: ({ saleId }, args, { saleLoader }) =>
      saleId && saleLoader.load(saleId),

    total: async ({ projectId, saleId }, args, { models, subdomain }) => {
      if (projectId) {
        const totalSum = await models.Task.sum("total", {
          where: { projectId },
          searchPath: subdomain
        });

        return totalSum ? totalSum : 0;
      }
      if (saleId) {
        return models.Item.sum(
          "total",
          { where: { saleId }, searchPath: subdomain },
          { raw: true }
        );
      }
      return null;
    }
  },

  Invoice: {
    customer: ({ customerId }, args, { models, subdomain }) =>
      models.Customer.findOne({
        where: { id: customerId },
        searchPath: subdomain
      }),

    project: ({ projectId }, args, { models, subdomain }) =>
      models.Project.findOne({
        where: { id: projectId },
        searchPath: subdomain
      }),

    sale: ({ saleId }, args, { models, subdomain }) =>
      models.Sale.findOne({ where: { id: saleId }, searchPath: subdomain }),

    user: ({ userId }, args, { models, subdomain }) =>
      models.User.findOne({ where: { id: userId }, searchPath: subdomain }),

    total: async ({ projectId, saleId }, args, { models, subdomain }) => {
      if (projectId) {
        const totalSum = await models.Task.sum("total", {
          where: { projectId },
          searchPath: subdomain
        });

        return totalSum ? totalSum : 0;
      }
      if (saleId) {
        return models.Item.sum(
          "total",
          { where: { saleId }, searchPath: subdomain },
          { raw: true }
        );
      }
      return null;
    }
  }
};
