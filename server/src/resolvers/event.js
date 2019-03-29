import Sequelize from "sequelize";

import requiresAuth from "../middlewares/authentication";
import { formatErrors } from "../utils/formatErrors";

export default {
  Query: {
    getEvents: requiresAuth.createResolver(
      (parent, args, { models, subdomain }) =>
        models.Event.findAll({ searchPath: subdomain })
    ),

    getProjectEvents: requiresAuth.createResolver(
      (parent, args, { models, subdomain }) =>
        models.Project.findAll({
          where: {
            deadline: {
              [Sequelize.Op.gt]: new Date()
            }
          },
          searchPath: subdomain
        })
          .then(project => {
            return {
              id: project.id,
              title: project.name,
              description: project.description,
              start: project.deadline,
              end: project.deadline
            };
          })
          .catch(err => {
            console.log("err: ", err);
          })
    ),

    getSaleEvents: requiresAuth.createResolver(
      (parent, args, { models, subdomain }) =>
        models.Sale.findAll({
          where: {
            deadline: {
              [Sequelize.Op.gt]: new Date()
            }
          },
          searchPath: subdomain
        })
    )
  },

  Mutation: {
    createEvent: requiresAuth.createResolver(
      (parent, args, { models, user, subdomain }) =>
        models.Event.create(
          { ...args, userId: user.id },
          { searchPath: subdomain }
        )
          .then(event => {
            return {
              success: true,
              event
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

    updateEvent: requiresAuth.createResolver(
      (parent, args, { models, subdomain }) =>
        models.Event.update(args, {
          where: { id: args.id },
          returning: true,
          plain: true,
          searchPath: subdomain
        })
          .then(result => {
            return {
              success: true,
              event: result[1].dataValues
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

    deleteEvent: requiresAuth.createResolver(
      (parent, args, { models, subdomain }) =>
        models.Event.destroy({
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
