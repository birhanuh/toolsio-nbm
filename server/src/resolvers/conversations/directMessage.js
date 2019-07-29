import Sequelize from "sequelize";
import { withFilter } from "graphql-subscriptions";

import requiresAuth, {
  requiresDirectMessageAccess
} from "../../middlewares/authentication";
import { formatErrors } from "../../utils/formatErrors";
import {
  processUpload,
  sendUploadToGCP,
  deleteUploadFromGCP
} from "../../utils/uploadFile";

import pubsub from "../../utils/pubsub";
import { NEW_DIRECT_MESSAGE } from "../../utils/constants";

export default {
  Subscription: {
    getNewDirectMessage: {
      subscribe: requiresDirectMessageAccess.createResolver(
        withFilter(
          () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
          (payload, args, { user }) => {
            return (
              (payload.getNewDirectMessage.senderId === user.id &&
                payload.getNewDirectMessage.receiverId === args.receiverId) ||
              (payload.getNewDirectMessage.senderId === args.receiverId &&
                payload.getNewDirectMessage.receiverId === user.id)
            );
          }
        )
      )
    }
  },

  Query: {
    getDirectMessage: requiresAuth.createResolver(
      (_, { id }, { models, subdomain }) =>
        models.DirectMessage.findOne(
          { where: { id }, searchPath: subdomain },
          { raw: true }
        )
    ),

    getDirectMessages: requiresAuth.createResolver(
      (_, { receiverId, cursor }, { models, subdomain, user }) => {
        const options = {
          where: {
            [Sequelize.Op.or]: [
              {
                [Sequelize.Op.and]: [
                  { receiverId: receiverId, senderId: user.id }
                ]
              },
              {
                [Sequelize.Op.and]: [
                  { senderId: receiverId, receiverId: user.id }
                ]
              }
            ]
          },
          order: [["created_at", "DESC"]],
          limit: 10,
          searchPath: subdomain
        };

        if (cursor) {
          options.where.created_at = {
            [Sequelize.Op.lt]: cursor
          };
        }

        return models.DirectMessage.findAll(options, { raw: true });
      }
    ),

    getDirectMessageUsers: requiresAuth.createResolver(
      (_, args, { models, subdomain }) =>
        models.sequelize.query(
          "select distinct on (u.id) u.id, u.first_name, u.email from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id)",
          {
            model: models.User,
            raw: true,
            searchPath: subdomain
          }
        )
    ),

    getSentDirectMessages: requiresAuth.createResolver(
      (_, __, { models, subdomain, user }) =>
        models.DirectMessage.findAll(
          {
            where: { senderId: user.id },
            order: [["created_at", "ASC"]],
            searchPath: subdomain
          },
          { raw: true }
        )
    ),

    getInboxDirectMessages: requiresAuth.createResolver(
      (_, __, { models, subdomain, user }) =>
        models.DirectMessage.findAll(
          {
            include: [
              {
                model: models.User,
                where: { receiverId: user.id }
              }
            ],
            order: [["created_at", "ASC"]],
            searchPath: subdomain
          },
          { raw: true }
        )
    ),

    getUnreadDirectMessagesCount: requiresAuth.createResolver(
      (_, __, { models, subdomain, user }) =>
        models.DirectMessage.count(
          {
            where: {
              receiverId: user.id,
              senderId: { [Sequelize.Op.ne]: user.id },
              isRead: false
            },
            searchPath: subdomain
          },
          { raw: true }
        )
          .then(count => {
            return {
              count
            };
          })
          .catch(err => {
            console.log("err: ", err);
          })
    ),

    getUnreadDirectMessagesCountSender: requiresAuth.createResolver(
      (_, __, { models, subdomain, user }) =>
        models.sequelize
          .query(
            "SELECT count(*), sender_id FROM direct_messages WHERE receiver_id = " +
              user.id +
              " AND sender_id<>" +
              user.id +
              " AND is_read=false GROUP BY sender_id",
            {
              model: models.DirectMessage,
              raw: true,
              searchPath: subdomain
            }
          )
          .then(result => {
            return {
              success: true,
              unreadDirectMessagesCountSender: result
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

  Mutation: {
    createDirectMessage: requiresAuth.createResolver(
      async (_, { file, ...args }, { models, subdomain, user }) => {
        try {
          const messageData = args;

          if (file) {
            //const uploadFile = await processUpload(file);
            const uploadFile = await sendUploadToGCP(file, "direct-messages");

            messageData.uploadPath = uploadFile.path;
            messageData.mimetype = uploadFile.mimetype;
          }

          const message = await models.DirectMessage.create(
            { ...messageData, senderId: user.id },
            { searchPath: subdomain }
          );

          // Do both asynchronously
          const asyncFunc = async () => {
            const author = await models.User.findOne(
              { where: { id: user.id }, searchPath: subdomain },
              { raw: true }
            );

            pubsub.publish(NEW_DIRECT_MESSAGE, {
              receiverId: args.receiverId,
              senderId: user.id,
              getNewDirectMessage: {
                ...message.dataValues,
                user: author.dataValues
              }
            });
          };

          asyncFunc();

          return {
            success: true,
            message
          };
        } catch (err) {
          console.log("err: ", err);
          return {
            success: false,
            errors: formatErrors(err)
          };
        }
      }
    ),

    markDirectMessagesAsRead: requiresAuth.createResolver(
      (_, args, { models, subdomain, user }) =>
        models.DirectMessage.update(
          { isRead: true },
          {
            where: { receiverId: user.id, senderId: args.senderId },
            searchPath: subdomain
          }
        )
          .then(() => {
            return {
              success: true
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

    deleteDirectMessages: requiresAuth.createResolver(
      async (_, { receiverId }, { models, subdomain, user }) => {
        const options = {
          where: {
            [Sequelize.Op.or]: [
              {
                [Sequelize.Op.and]: [
                  { receiverId: receiverId, senderId: user.id }
                ]
              },
              {
                [Sequelize.Op.and]: [
                  { senderId: receiverId, receiverId: user.id }
                ]
              }
            ],
            uploadPath: { [Sequelize.Op.ne]: null }
          },
          searchPath: subdomain
        };

        const messages = await models.DirectMessage.findAll(options, {
          raw: true
        });

        return models.DirectMessage.destroy(options)
          .then(() => {
            const promises = messages.map(message =>
              deleteUploadFromGCP(message.uploadPath)
            );

            Promise.all(promises);

            return {
              success: true
            };
          })
          .catch(err => {
            console.log("err: ", err);
            return {
              success: false,
              errors: formatErrors(err)
            };
          });
      }
    )
  },

  DirectMessage: {
    uploadPath: parent =>
      // parent.uploadPath && process.env.SERVER_URL + parent.uploadPath, // Used if proceddUpload function is used
      parent.uploadPath && parent.uploadPath,

    user: ({ user, senderId }, args, { userLoader }) => {
      if (user) {
        return user;
      }
      return userLoader.load(senderId);
    }
  }
};
