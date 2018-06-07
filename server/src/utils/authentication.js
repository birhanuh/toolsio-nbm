import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

export const createAuthTokens = async (user, secret, secret2) => {
  const createAuthToken = jwt.sign(
    {
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

export const refreshAuthTokens = async (authToken, refreshAuthToken, models, SECRET, SECRET2) => {
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

  const user = await models.User.findOne({ where: { id: userId }, raw: true })

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
  
  const [newAuthToken, newRefreshAuthToken] = await createAuthTokens(user, SECRET, refreshSecret)
  
  return {    
    authToken: newAuthToken,
    refreshAuthToken: newRefreshAuthToken,
    user
  } 
}

export const loginUserWithToken = async (email, password, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({ where: { email }, raw: true })

  if (!user) {
    // user not found
    return {
      success: false,     
      errors: [{ 
        path: 'password',
        message: 'Incorrect email or password.'
      }]
    } 
  }

  const valid = bcrypt.compareSync(password, user.password)

  if (!valid) {
    // user not found
    return {
      success: false,     
      errors: [{ 
        path: 'password',
        message: 'Incorrect email or password.'
      }]
    } 
  }

  const refreshAuthTokenSecret = user.password + SECRET2

  const [authToken, refreshAuthToken] = await createAuthTokens(user, SECRET, refreshAuthTokenSecret)
  // user found
  return {
    success: true,    
    authToken,
    refreshAuthToken
  } 
}



