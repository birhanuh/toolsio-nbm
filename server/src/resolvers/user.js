import { formatErrors } from '../utils/formatErrors'
import requiresAuth from '../middlewares/authentication'

import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

// AWS
import AWS from 'aws-sdk'

// Cloudinary
import cloudinary from 'cloudinary'

import Email from 'email-templates'

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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})


export default {
  Query: {
    getUser: requiresAuth.createResolver((parent, { id }, { models, subdomain }) => models.User.findOne({ where: { id }, searchPath: subdomain }, { raw: true })),

    getUserByEmail: requiresAuth.createResolver((parent, { email }, { models, subdomain }) => models.User.findOne({ where: { email }, searchPath: subdomain }, { raw: true })),

    getUsers: requiresAuth.createResolver((parent, args, { models, subdomain }) => models.User.findAll({ searchPath: subdomain }))
  },

  Mutation: {
    sendInvitation: requiresAuth.createResolver(async (parent, args, { user, subdomain }) => {
     
      let emailToken

      try {
        // Create emailToken
        emailToken = jwt.sign({
          email: args.email,
          account: subdomain
        }, process.env.JWTSECRET1, { expiresIn: '60d' })
      } catch(err) {
        console.log('err', err)
      }

      const url = `http://${subdomain}.lvh.me:3000/signup/invitation/?token=${emailToken}`
      
      const email = new Email({
        message: {
          from: 'no-replay@toolsio.com'
        },
        // uncomment below to send emails in development/test env:
        send: true,
        // transport: {
        //   jsonTransport: true
        // }
        transport: transporter
      })

      return email
        .send({
          template: 'user_invitation',
          message: {
            to: args.email,
            subject: 'Complete your Registration (Toolsio)'
          },
          locals: {
            account: subdomain,
            email: args.email,
            inviter: user.firstName,
            invitationLink: url,
          }
        })
        .then(res => {
          console.log('User invitationn success: ', res)
          // Retrun success true to client on success
          return {
            success: true
          }
        })
        .catch(err => {
          console.log('User invitationn success: ', err)
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

    updateUser: requiresAuth.createResolver((parent, args, { models, subdomain }) => {
      // Do both asynchronously
      const asyncFunc = async () => {
        var user = await models.User.findOne({ where: { email: args.email }, searchPath: subdomain }, { raw: true })
         console.log('argsz: ', args)
         console.log('userz: ', user)
        if(args.avatarUrl !== user.avatarUrl) {
          cloudinary.v2.uploader.destroy(user.dataValues.avatarUrl, function(error, result){
            if (error) {
              console.log('cloudinary remove file error:', error)
            }
            console.log('cloudinary remove file result: ', result)
          })
        }
      }

      asyncFunc()

      return models.User.update(args, { where: {email: args.email}, returning: true, plain: true, searchPath: subdomain })
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
        })
    })    
    
  }    
}