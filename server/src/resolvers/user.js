import { formatErrors } from '../utils/formatErrors'
import requiresAuth from '../middlewares/authentication'

import bcrypt from 'bcrypt-nodejs'

// AWS
import AWS from 'aws-sdk'

// Cloudinary
import cloudinary from 'cloudinary'

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
    getCurrentUser: requiresAuth.createResolver((parent, args, { models, req, subdomain }) => models.User.findOne({ where: { id: req.session.userId }, searchPath: subdomain }, { raw: true })),

    getUser: requiresAuth.createResolver((parent, { id }, { models, subdomain }) => models.User.findOne({ where: { id }, searchPath: subdomain }, { raw: true })),

    getUserByEmail: requiresAuth.createResolver((parent, { email }, { models, subdomain }) => models.User.findOne({ where: { email }, searchPath: subdomain }, { raw: true })),

    getUsers: requiresAuth.createResolver((parent, args, { models, subdomain }) => models.User.findAll({ searchPath: subdomain }))
  },

  Mutation: {
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
    }),

    updateUserPassword: requiresAuth.createResolver(async (parent, args, { models, user, subdomain }) => {
      // Do both asynchronously
      var userFound = await models.User.findOne({ where: { email: user.email }, searchPath: subdomain }, { raw: true })
  
      const valid = bcrypt.compareSync(args.currentPassword, userFound.password)

      if (valid) {
        return models.User.update({password: args.newPassword}, { where: {email: user.email}, returning: true, plain: true, searchPath: subdomain })
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
      } else {
        return {
          success: false,
          errors: [
            {
              path: 'currentPassword',
              message: "Current password doesn't match"
            }
          ]
        }
      }
      
    })        
    
  }    
}