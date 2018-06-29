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