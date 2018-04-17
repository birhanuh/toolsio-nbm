import { formatErrors } from '../utils/formatErrors'
import { loginUserWithToken } from '../utils/authentication'
import { requiresAuth } from '../middlewares/authentication'
// AWS
import AWS from 'aws-sdk'

export default {
  Query: {
    getUser: requiresAuth.createResolver((parent, { email }, { models }) => models.User.findOne({ where: { email } }, { raw: true })),
    getUsers: requiresAuth.createResolver((parent, args, { models }) => models.User.findAll())
  },

  Mutation: {
    loginUser: (parent, { email, password }, { models, SECRET, SECRET2 }) => 
      loginUserWithToken(email, password, models, SECRET, SECRET2),
    
    registerUser: async (parent, args, { models }) => {

      const { firstName, lastName, email, password } = args
      const { subdomain, industry } = args

      try {
        const account = await models.Account.findOne({ where: {subdomain}}, { raw: true })

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

            const user = await  models.User.create({ firstName, lastName, email, password }, { transaction })
            await models.Account.create({ subdomain, industry, owner: user.id }, { transaction })

            return user
          })
      
          return {
            success: true,
            user: response
          }
        }
      } catch(err) {
        console.log(err)
        return {
          success: false,
          errors: formatErrors(err, models)
        }       
      }

    },

    s3SignAvatar: requiresAuth.createResolver(async (parent, args, { models }) => {

      const s3Bucket = new AWS.S3({
        signatureVersion: 'v4',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        Bucket: process.env.S3_BUCKET,
        region: 'eu-central-1'
      })

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
        console.log(err)
        return {
          errors: err
        }
      }
    })    
  }    
}