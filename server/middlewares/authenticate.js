import jwtDecode from 'jwt-decode'
import config from '../config'

import User from '../models/user'

// next is a callback function that calles the next function in chain 
export default (req, res, next) => {
  const authorizationHeader = req.headers['authorization']
  let token

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1]
  }

  if (token) {
    jwtDecode.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Failed to authenticate' })
      } else {
        User.findAsync({ id: decoded.id }).fetch().then(user => {
          if (!user) {
            res.status(401).json({ error: 'No such user' })
          } else {
            req.currentUser = user
            next()
          }
        })
      }
    })
  } else {
    res.status(403).json({
      error: 'No token provided'
    })
  }
}