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

// Checks if user in on Adimin role
// export const requireAdmin = requiresAuth.createResolver((parent, args, context ) => {
//   if (!context.user.isAdmin) {
//     throw new Error('Requires admin access')
//   }
// })