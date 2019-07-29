import requiresAuth from "../../middlewares/authentication";
import { formatErrors } from "../../utils/formatErrors";
import { deleteUploadFromGCP } from "../../utils/uploadFile";

export default {
  Query: {
    getChannel: requiresAuth.createResolver(
      (_, { id }, { models, subdomain }) =>
        models.Channel.findOne({ where: { id }, searchPath: subdomain })
    ),

    getChannelsUsersCount: requiresAuth.createResolver(
      (_, __, { models, subdomain, user }) =>
        models.Channel.findAll(
          {
            include: [
              {
                model: models.User,
                where: { id: user.id }
              }
            ],
            searchPath: subdomain
          },
          { raw: true }
        )
    )
  },

  Mutation: {
    createChannel: requiresAuth.createResolver(
      async (_, { name, isPublic }, { models, user, subdomain }) => {
        try {
          const channel = await models.Channel.findOne(
            { where: { name }, searchPath: subdomain },
            { raw: true }
          );

          if (channel) {
            return {
              success: false,
              errors: [
                {
                  path: "name",
                  message: "Channel name is already taken"
                }
              ]
            };
          } else {
            const channelCreated = await models.Channel.create(
              { name, isPublic, owner: user.id },
              { searchPath: subdomain }
            );

            await models.Member.create(
              { userId: user.id, channelId: channelCreated.dataValues.id },
              { searchPath: subdomain }
            );

            return {
              success: true,
              channel: channelCreated
            };
          }
        } catch (err) {
          console.log("err: ", err);
          return {
            success: false,
            errors: formatErrors(err)
          };
        }
      }
    ),

    addMember: requiresAuth.createResolver(
      async (_, { members, channelId }, { models, subdomain }) => {
        try {
          const membersCreated = await models.Member.bulkCreate(
            members.map(member => ({ userId: member, channelId: channelId })),
            { searchPath: subdomain }
          );

          return {
            success: true,
            members: membersCreated.map(member => member.dataValues.userId)
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

    deleteChannel: requiresAuth.createResolver(
      async (_, { channelId }, { models, subdomain }) => {
        const messages = await models.ChannelMessage.findAll(
          {
            where: { channelId: channelId },
            searchPath: subdomain
          },
          { raw: true }
        );

        return models.Channel.destroy({
          where: { id: channelId },
          force: true,
          searchPath: subdomain
        })
          .then(res => {
            const promises = messages.map(message => {
              if (message.uploadPath) {
                return deleteUploadFromGCP(message.uploadPath);
              }
            });

            Promise.all(promises)
              .then()
              .catch(err => console.log("err gcp: ", err));

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
          });
      }
    )
  },

  Channel: {
    usersInChannel: ({ id }, __, { models, subdomain }) => {
      return models.User.findAll(
        {
          include: [
            {
              model: models.Channel,
              where: { id: id }
            }
          ],
          searchPath: subdomain
        },
        { raw: true }
      );
    },

    usersNotInChannel: ({ id }, __, { models, subdomain }) => {
      return models.sequelize.query(
        "SELECT u.id, u.email FROM users u LEFT JOIN (SELECT u.id, u.email FROM users u INNER JOIN members m ON m.channel_id=:channelId AND u.id = m.user_id) m ON u.id = m.id WHERE m.id IS NULL",
        {
          replacements: { channelId: id },
          model: models.Channel,
          raw: true,
          searchPath: subdomain
        }
      );
    }
  },

  GetChannelsUsersCountResponse: {
    usersCount: ({ id }, __, { models, subdomain }) => {
      return models.User.count(
        {
          include: [
            {
              model: models.Channel,
              where: { id: id }
            }
          ],
          searchPath: subdomain
        },
        { raw: true }
      );
    }
  }
};
