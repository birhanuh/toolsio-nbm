import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import nodemailer from 'nodemailer'
import AWS from 'aws-sdk'

// Config
import config from '../config/jwt'

let env = process.env.NODE_ENV || 'development'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

export const createAuthTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ['id', 'firstName', 'email', 'isAdmin']),
    },
    secret,
    {
      expiresIn: '1h',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, ['id']),
    },
    secret2,
    {
      expiresIn: '7d',
    },
  );

  return [createToken, createRefreshToken];
};

export const refreshAuthTokens = async (authToken, refreshAuthToken, models, SECRET, SECRET2) => {
  let userId = 0

  try {
    const { user: { id } } = jwt.decode(refreshAuthToken)
    userId = id
  } catch(err) {
    return
  }

  if (!userId) {
    return
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true })

  if (!user) {
    // user not found
    return 
  }

  try {
    jwt.verify(refreshAuthToken, user.password + SECRET2)
  } catch (err) {
    return
  }

  const [newToken, newRefreshToken] = await createToken(user, SECRET, user.password + SECRET2)
  return {    
    authToken, newToken,
    refreshAuthToken: newRefreshToken,
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

  const valid = await bcrypt.compare(password, user.password)

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



