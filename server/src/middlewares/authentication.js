export function ensureAuthenticated(req, res, next) {
  console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`)
  if(req.isAuthenticated()) {
    return next()
  } else {
    //res.redirect('/users/login')
    res.status(401).json({ error: 'Failed to authenticate' })
  }
}

const createResolver = (resolver) => {
  const baseResolver = resolver
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info)
      return childResolver(parent, args, context, info)
    }
    return createResolver(newResolver)
  }
  return baseResolver
}

export const requiresAuth = createResolver((parent, args, context ) => {
  if (!context.user || !context.user.id) {
    throw new Error('Not authenticated')
  }
})

export const requiresChannelAccess = createResolver(async (parent, { channelId }, { user, models} ) => {
  if (!user || !user.id) {
    throw new Error('Not authenticated')
  }
  // Check if part of the member
  const memeber = await models.Member.findOne({ where: { channelId, userId: user.id } })
 
  if (!member) {
    throw new Error("You have to be a member of the channel to subscribe for it's messages")
  }
  
})

export const requiresDirectMessageAccess = createResolver(async (parent, { receiverId }, { models, user }) => {
  if (!user || !user.id) {
    throw new Error('Not authenticated')
  }

  const directMessagers = await models.DirectMessage.findAll({
    where: {
      [models.sequelize.Op.or]: [{ recieverId }, { senderId: user.id }],
    },
  })
  console.log('directMessagers ', directMessagers)
  if (directMessagers.length !== 2) {
    throw new Error('Something went wrong');
  }
})

// Checks if user in on Adimin role
// export const requireAdmin = requiresAuth.createResolver((parent, args, context ) => {
//   if (!context.user.isAdmin) {
//     throw new Error('Requires admin access')
//   }
// })