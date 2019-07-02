import Sequelize from "sequelize";

export function ensureAuthenticated(req, res, next) {
  console.log(
    `req.session.passport.user: ${JSON.stringify(req.session.passport)}`
  );
  if (req.isAuthenticated()) {
    return next();
  } else {
    //res.redirect('/users/login')
    res.status(401).json({ error: "Failed to authenticate" });
  }
}

const createResolver = resolver => {
  const baseResolver = resolver;
  baseResolver.createResolver = childResolver => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

// requiresAuth
export default createResolver((parent, args, context) => {
  if (!context.user || !context.user.id) {
    throw new Error("Not authenticated");
  }
});

export const requiresChannelAccess = createResolver(
  async (_, { channelId }, { models, subdomain, user }) => {
    if (!user || !user.id) {
      throw new Error("Not authenticated");
    }

    // Check if part of the member
    const member = await models.Member.findOne({
      where: { channelId, userId: user.id },
      searchPath: subdomain
    });

    if (!member) {
      throw new Error(
        "You have to be a member of the channel to subscribe for it's messages"
      );
    }
  }
);

export const requiresDirectMessageAccess = createResolver(
  async (_, { receiverId }, { models, subdomain, user }) => {
    if (!user || !user.id) {
      throw new Error("Not authenticated");
    }

    const users = await models.User.findAll({
      where: {
        [Sequelize.Op.or]: [{ id: receiverId }, { id: user.id }]
      },
      searchPath: subdomain
    });

    if (!users) {
      throw new Error("Something went wrong");
    }
  }
);

// Checks if user in on Adimin role
// export const requireAdmin = requiresAuth.createResolver((parent, args, context ) => {
//   if (!context.user.isAdmin) {
//     throw new Error('Requires admin access')
//   }
// })
