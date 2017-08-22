export function ensureAuthenticated(req, res, next) {
  console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`)
  if(req.isAuthenticated()) {
    return next()
  } else {
    //res.redirect('/users/login')
    res.status(401).json({ error: 'Failed to authenticate' })
  }
}
