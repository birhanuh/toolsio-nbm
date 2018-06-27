import { formatErrors } from '../utils/formatErrors'
import { loginUserWithToken } from '../utils/authentication'
import requiresAuth from '../middlewares/authentication'

// Loadash
import map from 'lodash/map'

import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

// AWS
import AWS from 'aws-sdk'

// jwt config
import jwtConfig from '../../config/jwt.json'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

const s3Bucket = new AWS.S3({
  signatureVersion: 'v4',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  Bucket: process.env.S3_BUCKET,
  region: 'eu-central-1'
})

export default {
  Query: {
    getUser: requiresAuth.createResolver((parent, { id }, { models, subdomain }) => models.User.findOne({ where: { id }, searchPath: subdomain }, { raw: true })),

    getUserByEmail: requiresAuth.createResolver((parent, { email }, { models, subdomain }) => models.User.findOne({ where: { email }, searchPath: subdomain }, { raw: true })),

    getUsers: requiresAuth.createResolver((parent, args, { models, subdomain }) => models.User.findAll({ searchPath: subdomain }))
  },

  Mutation: {
    loginUser: (parent, { email, password }, { models, SECRET, SECRET2 }) => 
      loginUserWithToken(email, password, models, SECRET, SECRET2),
    
    registerUser: async (parent, args, { models }) => {

      const { firstName, lastName, email, password } = args
      const { subdomain, industry } = args

      try {
        const account = await models.Account.findOne( { where: { subdomain } }, { raw: true })

        if (account) {
          return {
            success: false,
            errors: [
              {
                path: 'subdomain',
                message: 'Subdomain is already taken'
              }
            ]
          }
        } else {
          const response = await models.sequelize.transaction(async (transaction) => {
            
            // Creates a schema
            await models.sequelize.createSchema(subdomain)

            // Migrate users model 
            await models.User.sync({schema: subdomain})
            
            // Sync the reset schemas asynchronously
            Promise.all(
              map(Object.keys(models), (key) => {
                if (['sequelize', 'Sequelize', 'Account', 'User'].includes(key)) return
                models[key].sync({schema: subdomain})
              })
            )

            const user = await  models.User.create({ firstName, lastName, email, password }, { searchPath: subdomain, transaction })
            const account = await models.Account.create({ subdomain, industry, owner: user.id }, { transaction })

            return { user, account } 
          })

          // Create emailToken
          jwt.sign({
            id: response.user.dataValues.id,
            email: response.user.dataValues.email
          }, jwtConfig.jwtSecret1, { expiresIn: '60d' }, (err, emailToken) => {
            if (err) {
              console.log('err token: ', err)
            }
            
            const url = `http://${response.account.subdomain}.lvh.me:3000/login/confirmation/${emailToken}`

            transporter.sendMail({
              to: userCreated.get('email'),
              subject: 'Confirm Email (Toolsio)',
              html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
            })
          })
      
          return {
            success: true,
            account: response.account
          }
        }
      } catch(err) {
        console.log('err: ', err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }       
      }

    },

    registerInvitedUser: async (parent, args, { models }) => {

      const { firstName, lastName, email, password, token } = args

      const { account } = jwt.verify(token, jwtConfig.jwtSecret1)

      try {
        const accountLocal = await models.Account.findOne( { where: { subdomain: account } }, { raw: true })

        if (accountLocal) {

          try {
            const user = await  models.User.schema(accountLocal.subdomain).create({ firstName, lastName, email, password }, { searchPath: accountLocal.subdomain })

            // Create emailToken
            jwt.sign({
              id: user.dataValues.id,
              email: user.dataValues.email
            }, jwtConfig.jwtSecret1, { expiresIn: '60d' }, (err, emailToken) => {
              if (err) {
                console.log('err token: ', err)
              }
              
              const url = `http://${accountLocal.dataValues.subdomain}.lvh.me:3000/login/confirmation/${emailToken}`

              transporter.sendMail({
                to: userCreated.get('email'),
                subject: 'Confirm Email (Toolsio)',
                html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
              })
            })
        
            return {
              success: true,
              account: accountLocal
            }
          } catch(err) {
            console.log('err: ', err)
            return {
              success: false,
              errors: formatErrors(err, models)
            }       
          }
        } else {
          return {
            success: false,
            errors: [
              {
                path: 'subdomain',
                message: `Account *${account}* to which you are invited doesn't exist. You can create it as your own new account by going to sign up page`
              }
            ]
          }
        }
      } catch(err) {
        console.log('err: ', err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }       
      }

    },

    sendInvitation: requiresAuth.createResolver((parent, args, { subdomain }) => {
      
      let emailToken

      try {
        // Create emailToken
        emailToken = jwt.sign({
          email: args.email,
          account: subdomain
        }, jwtConfig.jwtSecret1, { expiresIn: '60d' })
      } catch(err) {
        console.log('err', err)
      }

      const url = `http://${subdomain}.lvh.me:3000/signup/invitation/?token=${emailToken}`
      console.log('url: ', url)
      return transporter.sendMail({
        to: args.email,
        subject: 'Invitation Email (Toolsio)',
        html: `You are invited to join ${subdomain}. Please click this link to accept you invitation and sign up: <a href="${url}">${url}</a>`
      }).then(res => {
        console.log('yea: ', res)
        // Retrun success true to client on success
        return {
          success: true
        }
      })
      .catch(err => {
        console.log('err: ', err)
        return {
          success: false, 
          errors: err
        }
      })    
      
    }),

    s3SignAvatar: requiresAuth.createResolver(async (parent, args) => {

      const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: args.fileName,
        Expires: 60,
        ContentType: args.fileType,
        ACL: 'public-read'
      }

      try {
        const signedRequest = await s3Bucket.getSignedUrl('putObject', s3Params)
        const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${args.fileName}`

        return {
          signedRequest, 
          url
        }
      } catch (err) {
        console.log('err: ', err)
        return {
          success: false, 
          errors: [{ 
            path: 'signedRequest',
            message: err 
          }]
        }
      }
    }),

    updateUser: requiresAuth.createResolver((parent, args, { models, subdomain }) => 
      models.User.schema(subdomain).update(args, { where: {email: args.email}, returning: true, plain: true, searchPath: subdomain })
        .then(result => {  
          return {
            success: true,
            user: result[1].dataValues
          }
        })
        .catch(err => {
          console.log('err: ', err)
          return {
            success: false,
            errors: formatErrors(err, models)
          }
        })),    
  }    
}