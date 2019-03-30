import Sequelize from "sequelize";
import { withFilter } from "graphql-subscriptions";

import requiresAuth, {
  requiresChannelAccess
} from "../../middlewares/authentication";
import { formatErrors } from "../../utils/formatErrors";
import { processUpload } from "../../utils/uploadFile";

import pubsub from "../../utils/pubsub";

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

export default {
  Subscription: {
    getNewChannelMessage: {
      subscribe: requiresChannelAccess.createResolver(
        withFilter(
          () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
          (payload, args) => payload.channelId === args.channelId
        )
      )
    }
  },

  Query: {
    getChannelMessage: requiresAuth.createResolver(
      (parent, { id }, { models, subdomain }) =>
        models.ChannelMessage.findOne(
          { where: { id }, searchPath: subdomain },
          { raw: true }
        )
    ),

    getChannelMessages: requiresAuth.createResolver(
      (parent, { channelId, cursor }, { models, subdomain }) => {
        const options = {
          where: { channelId: channelId },
          order: [["created_at", "DESC"]],
          limit: 10,
          searchPath: subdomain
        };

        if (cursor) {
          options.where.created_at = {
            [Sequelize.Op.lt]: cursor
          };
        }

        return models.ChannelMessage.findAll(options, { raw: true });
      }
    )
  },

  Mutation: {
    createChannelMessage: requiresAuth.createResolver(
      async (parent, { file, ...args }, { models, subdomain, user }) => {
        try {
          const messageData = args;

          if (file) {
            const uploadFile = await processUpload(file);
            messageData.uploadPath = uploadFile.path;
            messageData.mimetype = uploadFile.mimetype;
          }

          const message = await models.ChannelMessage.create(
            { ...messageData, userId: user.id },
            { searchPath: subdomain }
          );

          // Do both asynchronously
          const asyncFunc = async () => {
            const author = await models.User.findOne(
              { where: { id: user.id }, searchPath: subdomain },
              { raw: true }
            );

            pubsub.publish(NEW_CHANNEL_MESSAGE, {
              channelId: args.channelId,
              getNewChannelMessage: {
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
    )
  },

  ChannelMessage: {
    uploadPath: parent =>
      parent.uploadPath && process.env.SERVER_URL + parent.uploadPath,

    user: ({ user, userId }, args, { userLoader }) => {
      if (user) {
        return user;
      }
      return userLoader.load(userId);
    }
  }
};
