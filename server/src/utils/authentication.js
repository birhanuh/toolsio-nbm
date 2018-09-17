import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import passport from 'passport'

let LocalStrategy = require('passport-local').Strategy

export const createAuthTokens = async (subdomain, user, secret, secret2) => {
  const createAuthToken = jwt.sign(
    {
      account: subdomain,
      user: _.pick(user, ['id', 'firstName', 'email', 'isAdmin']),
    },
    secret,
    {
      expiresIn: '1h',
    },
  );

  const createRefreshAuthToken = jwt.sign(
    {
      user: _.pick(user, ['id']),
    },
    secret2,
    {
      expiresIn: '7d',
    },
  );

  return [createAuthToken, createRefreshAuthToken];
};

export const refreshAuthTokens = async (authToken, refreshAuthToken, models, subdomain, SECRET, SECRET2) => {
  let userId = 0

  try {
    const { user: { id } } = jwt.decode(refreshAuthToken)
    userId = id
  } catch(err) {
    return {}
  }

  if (!userId) {
    return {}
  }

  const user = await models.User.findOne({ where: { id: userId }, searchPath: subdomain }, { raw: true })

  if (!user) {
    // user not found
    return {}
  }

  const refreshSecret = user.password + SECRET2
   
  try {
    jwt.verify(refreshAuthToken, refreshSecret)
  } catch (err) {
    return {}
  }  
  
  const [newAuthToken, newRefreshAuthToken] = await createAuthTokens(subdomain, user, SECRET, refreshSecret)
  
  return {    
    authToken: newAuthToken,
    refreshAuthToken: newRefreshAuthToken,
    user
  } 
}

export const loginUserWithToken = async (email, password, models, subdomain, SECRET, SECRET2) => {
  const user = await models.User.findOne({ where: { email }, searchPath: subdomain }, { raw: true })
 
  if (!user) {
    // user not found
    return {
      success: false,     
      errors: [{ 
        path: 'email',
        message: 'Incorrect email or password.'
      }, { 
        path: 'password',
        message: 'Incorrect email or password.'
      }]
    } 
  }

  const valid = bcrypt.compareSync(password, user.password)

  if (!valid) {
    // email not valid
    return {
      success: false,     
      errors: [{ 
        path: 'email',
        message: 'Incorrect email or password.'
      }, { 
        path: 'password',
        message: 'Incorrect email or password.'
      }]
    } 
  }

  const refreshAuthTokenSecret = user.password + SECRET2

  const [authToken, refreshAuthToken] = await createAuthTokens(subdomain, user, SECRET, refreshAuthTokenSecret)
  // user found
  return {
    success: true,    
    authToken,
    refreshAuthToken
  } 
}
/*
export const loginUserPassportJs = async (req, email, password, models, subdomain) => {
  passport.authenticate('local'), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    
    console.log('reqz: ', req)
    return {
      success: true,    
      authToken: 'adf',
      refreshAuthToken: 'sdf'
    } 
  }
}
*/
// Login User
// router.post('/login', passport.authenticate('local'), function(req, res) {
//   // If this function gets called, authentication was successful.
//   // `req.user` contains the authenticated user.
//   if (req.user.get('is_confirmed')) {
//     res.json({ id: req.user.id, first_name: req.user.first_name, last_name: req.user.last_name, email: req.user.email, 
//       admin: req.user.admin })
    
//   } else {
//     res.status(500).json({ 
//       errors: {
//         confirmation: 'fail',
//         message: 'Please confirm your email to login'
//       }
//     })
//   }

// })

// router.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
    
//     if (err) { 
//       return next(err); 
//     }

//     if (!user) { 
//       res.status(500).json({ 
//         errors: {
//           confirmation: 'fail',
//           message: {
//             errors: {
//               email: {
//                 message: 'Incorrect email.'
//               },
//               password: {
//                 message: 'Incorrect password.'
//               }
//             }
//           }
//         }
//       })
//       return
//     }
    
//     if (user) {
//       req.logIn(user, function(err) {
//         if (err) { 
//           return next(err) 
//         }
    
//         if (user.get('is_confirmed')) {
//           res.json({ id: user.get('id'), first_name: user.get('first_name'), last_name: user.get('last_name'), email: user.get('email'), 
//             admin: user.get('admin'), account: user.get('account') })        
//         } else {
//           res.status(500).json({ 
//             errors: {
//               confirmation: 'fail',
//               message: 'Please confirm your email to login'
//             }
//           })
//         }
//       })
//       return
//     }
//   })(req, res, next)
// })

// router.post('/logout', function(req, res) {
//   req.logout()
//   req.session.destroy(function(err) {
//     if (err) {
//       res.status(500).json({ 
//         errors: {
//           confirmation: 'fail',
//           message: err
//         }
//       })
//       return
//     }
//     res.json({ success: true })
//   })
// })
/**
passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  models.User.findById(id, { searchPath: subdomain })
    .then(user => {
      done(null, user)
    })
    .catch(err => {
      done(err, null)
    })
})

passport.use(new LocalStrategy({usernameField: 'email'},
  async function(email, password, done) {
    onsole.log('reqz: ', user)
    const user = await models.User.findOne({ where: { email }, searchPath: subdomain }, { raw: true })

    console.log('reqz: ', user)
    if (!user) {
      // user not found
      return done(null, false)
    }

    const valid = bcrypt.compareSync(password, user.password)

    if (!valid) {
      // email not found
      return done(null, false)
    } else {
      return done(null, user)
    }

    // models.User.findOne({ where: {email: email}, raw: true })
    //   .then(user => {
    //     if (user) {
    //       models.User.comparePassword(password, user.get('password'), function(err, isMatch) {
    //         if (err) { return done(err); }
            
    //         if(isMatch){
    //           return done(null, user)
    //         } else {
    //           return done(null, false)
    //         }
    //       })
    //     } else {
    //       return done(null, false)
    //     }
    //   })
    //   .catch(err => { throw err })
  }
))

*/
